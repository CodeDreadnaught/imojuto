"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { requireCapability } from "@/lib/rbac";
import { requireSession } from "@/lib/session";
import { Assignment, RequestCategory, Role, ServiceRequest, StatusLog, User } from "@/models";
import type { RequestPriority } from "@/components/shared/PriorityBadge";
import type { RequestStatus } from "@/components/shared/StatusBadge";
import { notifyRequester } from "@/actions/notifications";

type RequestActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

type LeanPerson = {
  _id?: unknown;
  name?: string;
  email?: string;
};

type LeanCategory = {
  _id: unknown;
  name: string;
  slug?: string;
};

type LeanRequest = {
  _id: unknown;
  referenceCode: string;
  title: string;
  description: string;
  categoryId?: LeanCategory | unknown;
  requesterId?: LeanPerson | unknown;
  location: {
    building: string;
    roomOrArea: string;
    notes?: string | null;
  };
  priority: string;
  status: string;
  attachments?: { url: string; uploadedAt: Date | string }[];
  createdAt?: Date;
  updatedAt?: Date;
};

type LeanLog = {
  _id: unknown;
  actorId?: LeanPerson;
  fromStatus?: string;
  toStatus: string;
  note?: string;
  createdAt?: Date;
};

type LeanAssignment = {
  _id: unknown;
  serviceRequestId?: LeanRequest | unknown;
  officerId?: LeanPerson;
  assignedById?: LeanPerson;
  isActive: boolean;
  assignedAt?: Date;
  unassignedAt?: Date;
};

const priorityOrder: Record<RequestPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const createRequestSchema = z.object({
  title: z.string().trim().min(4, "Title must be at least 4 characters.").max(120),
  description: z.string().trim().min(10, "Description must be at least 10 characters.").max(1600),
  categoryId: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), "Choose a category."),
  building: z.string().trim().min(2, "Building is required.").max(80),
  roomOrArea: z.string().trim().min(1, "Room or area is required.").max(80),
  locationNotes: z.string().trim().max(240).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  attachments: z.string().optional(),
});

const statusTransitionSchema = z.object({
  requestId: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value)),
  toStatus: z.enum(["in_progress", "resolved", "closed", "reopened"]),
  note: z.string().trim().max(600).optional(),
});

function flatten(error: z.ZodError): RequestActionState {
  return {
    ok: false,
    message: "Check the highlighted fields and try again.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

async function nextReferenceCode() {
  const year = new Date().getFullYear();
  const count = await ServiceRequest.countDocuments({ referenceCode: new RegExp(`^IMJ-${year}-`) });
  return `IMJ-${year}-${String(count + 1).padStart(6, "0")}`;
}

function populatedName(value: unknown, fallback: string) {
  return typeof value === "object" && value !== null && "name" in value && typeof value.name === "string" ? value.name : fallback;
}

function populatedId(value: unknown) {
  return typeof value === "object" && value !== null && "_id" in value ? String(value._id) : String(value);
}

function serializeRequest(request: LeanRequest) {
  return {
    id: String(request._id),
    referenceCode: request.referenceCode,
    title: request.title,
    description: request.description,
    category: populatedName(request.categoryId, "Unknown category"),
    requester: populatedName(request.requesterId, "Unknown requester"),
    location: request.location,
    priority: request.priority as RequestPriority,
    status: request.status as RequestStatus,
    attachments: request.attachments ?? [],
    createdAt: request.createdAt?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: request.updatedAt?.toISOString?.() ?? new Date().toISOString(),
  };
}

export async function getActiveCategories() {
  await connectDb();
  const categories = await RequestCategory.find({ isActive: true }).sort({ name: 1 }).select("name slug").lean();
  return (categories as LeanCategory[]).map((category) => ({
    id: String(category._id),
    name: category.name,
    slug: category.slug,
  }));
}

export async function createServiceRequest(_state: RequestActionState, formData: FormData): Promise<RequestActionState> {
  const session = await requireSession();
  requireCapability(session, "request:create");

  const parsed = createRequestSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    building: formData.get("building"),
    roomOrArea: formData.get("roomOrArea"),
    locationNotes: formData.get("locationNotes") || undefined,
    priority: formData.get("priority"),
    attachments: formData.get("attachments") || undefined,
  });

  if (!parsed.success) {
    return flatten(parsed.error);
  }

  await connectDb();

  const category = await RequestCategory.findOne({ _id: parsed.data.categoryId, isActive: true }).select("_id");
  if (!category) {
    return {
      ok: false,
      message: "Choose an active category.",
      fieldErrors: { categoryId: ["Choose an active category."] },
    };
  }

  const attachments = parsed.data.attachments
    ? parsed.data.attachments
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean)
        .map((url) => ({ url, uploadedAt: new Date() }))
    : [];

  const request = await ServiceRequest.create({
    referenceCode: await nextReferenceCode(),
    title: parsed.data.title,
    description: parsed.data.description,
    categoryId: category._id,
    requesterId: session.user.userId,
    location: {
      building: parsed.data.building,
      roomOrArea: parsed.data.roomOrArea,
      notes: parsed.data.locationNotes,
    },
    priority: parsed.data.priority,
    status: "submitted",
    attachments,
  });

  await StatusLog.create({
    serviceRequestId: request._id,
    actorId: session.user.userId,
    toStatus: "submitted",
    note: "Request submitted.",
  });

  revalidatePath("/requests");
  redirect(`/requests/${request._id}`);
}

export async function listMyRequests(filters?: { status?: string; categoryId?: string; search?: string; page?: number }) {
  const session = await requireSession();
  requireCapability(session, "request:read:own");
  await connectDb();

  const query: Record<string, unknown> = { requesterId: session.user.userId };
  if (filters?.status) query.status = filters.status;
  if (filters?.categoryId) query.categoryId = filters.categoryId;
  if (filters?.search) {
    query.$or = [
      { title: new RegExp(filters.search, "i") },
      { referenceCode: new RegExp(filters.search, "i") },
    ];
  }

  const page = Math.max(1, filters?.page ?? 1);
  const limit = 10;
  const [items, total] = await Promise.all([
    ServiceRequest.find(query)
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ServiceRequest.countDocuments(query),
  ]);

  return {
    items: items.map((request) => serializeRequest(request as LeanRequest)),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getRequestDetail(id: string) {
  const session = await requireSession();
  await connectDb();

  const request = await ServiceRequest.findById(id).populate("categoryId", "name").populate("requesterId", "name email").lean();
  if (!request) {
    return null;
  }

  const canReadAll = session.user.permissions.includes("request:read:all");
  const canReadAssigned = session.user.permissions.includes("request:read:assigned");
  const isRequester = populatedId((request as LeanRequest).requesterId) === session.user.userId;

  let isAssignedOfficer = false;
  if (canReadAssigned) {
    const assignment = await Assignment.findOne({ serviceRequestId: id, officerId: session.user.userId, isActive: true }).select("_id");
    isAssignedOfficer = Boolean(assignment);
  }

  if (!canReadAll && !isRequester && !isAssignedOfficer) {
    redirect("/403");
  }

  const logs = await StatusLog.find({ serviceRequestId: id }).populate("actorId", "name").sort({ createdAt: 1 }).lean();
  const assignments = await Assignment.find({ serviceRequestId: id })
    .populate("officerId", "name email")
    .populate("assignedById", "name")
    .sort({ assignedAt: -1 })
    .lean();

  return {
    request: serializeRequest(request as LeanRequest),
    logs: (logs as LeanLog[]).map((log) => ({
      id: String(log._id),
      actor: log.actorId?.name ?? "System",
      fromStatus: log.fromStatus as RequestStatus | undefined,
      toStatus: log.toStatus as RequestStatus,
      note: log.note ?? "",
      createdAt: log.createdAt?.toISOString?.() ?? new Date().toISOString(),
    })),
    assignments: (assignments as LeanAssignment[]).map((assignment) => ({
      id: String(assignment._id),
      officer: assignment.officerId?.name ?? "Unknown officer",
      assignedBy: assignment.assignedById?.name ?? "Unknown admin",
      isActive: assignment.isActive,
      assignedAt: assignment.assignedAt?.toISOString?.() ?? new Date().toISOString(),
      unassignedAt: assignment.unassignedAt?.toISOString?.(),
    })),
    canReopen: isRequester || session.user.permissions.includes("request:reopen:any"),
  };
}

export async function listOfficerQueue() {
  const session = await requireSession();
  requireCapability(session, "request:read:assigned");
  await connectDb();

  const assignments = await Assignment.find({ officerId: session.user.userId, isActive: true })
    .populate({
      path: "serviceRequestId",
      populate: [
        { path: "categoryId", select: "name" },
        { path: "requesterId", select: "name email" },
      ],
    })
    .sort({ assignedAt: -1 })
    .lean();

  return assignments
    .map((assignment) => serializeRequest((assignment as LeanAssignment).serviceRequestId as LeanRequest))
    .filter((request) => ["assigned", "in_progress", "reopened"].includes(request.status))
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || a.createdAt.localeCompare(b.createdAt));
}

export async function updateRequestStatus(_state: RequestActionState, formData: FormData): Promise<RequestActionState> {
  const session = await requireSession();
  requireCapability(session, "request:update_status");
  const parsed = statusTransitionSchema.safeParse({
    requestId: formData.get("requestId"),
    toStatus: formData.get("toStatus"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return flatten(parsed.error);
  }

  await connectDb();

  const assignment = await Assignment.findOne({
    serviceRequestId: parsed.data.requestId,
    officerId: session.user.userId,
    isActive: true,
  }).select("_id");

  if (!assignment) {
    return { ok: false, message: "This request is not assigned to you." };
  }

  const request = await ServiceRequest.findById(parsed.data.requestId);
  if (!request) {
    return { ok: false, message: "Request was not found." };
  }

  const fromStatus = request.status;
  request.status = parsed.data.toStatus;
  await request.save();

  await StatusLog.create({
    serviceRequestId: request._id,
    actorId: session.user.userId,
    fromStatus,
    toStatus: parsed.data.toStatus,
    note: parsed.data.note,
  });

  await notifyRequester(
    String(request._id),
    `${request.referenceCode} changed to ${parsed.data.toStatus.replace("_", " ")}.`,
    parsed.data.toStatus === "resolved" ? "resolved" : "status_changed",
  );

  revalidatePath("/officer");
  revalidatePath(`/requests/${request._id}`);
  return { ok: true, message: "Status updated." };
}

export async function reopenRequest(formData: FormData) {
  const session = await requireSession();
  const requestId = String(formData.get("requestId") ?? "");
  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    throw new Error("Request id is invalid.");
  }

  await connectDb();
  const request = await ServiceRequest.findById(requestId);
  if (!request) {
    throw new Error("Request was not found.");
  }

  const isRequester = String(request.requesterId) === session.user.userId;
  if (!isRequester) {
    requireCapability(session, "request:reopen:any");
  }

  if (!["resolved", "closed"].includes(request.status)) {
    return;
  }

  const fromStatus = request.status;
  request.status = "reopened";
  await request.save();

  await StatusLog.create({
    serviceRequestId: request._id,
    actorId: session.user.userId,
    fromStatus,
    toStatus: "reopened",
    note: "Request reopened.",
  });

  revalidatePath(`/requests/${request._id}`);
}

export async function listAllRequests(filters?: { status?: string; categoryId?: string; priority?: string; officerId?: string; search?: string }) {
  const session = await requireSession();
  requireCapability(session, "request:read:all");
  await connectDb();

  const query: Record<string, unknown> = {};
  if (filters?.status) query.status = filters.status;
  if (filters?.categoryId) query.categoryId = filters.categoryId;
  if (filters?.priority) query.priority = filters.priority;
  if (filters?.search) {
    query.$or = [
      { title: new RegExp(filters.search, "i") },
      { referenceCode: new RegExp(filters.search, "i") },
    ];
  }

  let requestIds: string[] | undefined;
  if (filters?.officerId) {
    const assignments = await Assignment.find({ officerId: filters.officerId, isActive: true }).select("serviceRequestId").lean();
    requestIds = (assignments as { serviceRequestId: unknown }[]).map((assignment) => String(assignment.serviceRequestId));
    query._id = { $in: requestIds };
  }

  const requests = await ServiceRequest.find(query)
    .populate("categoryId", "name")
    .populate("requesterId", "name email")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return requests
    .map((request) => serializeRequest(request as LeanRequest))
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || b.createdAt.localeCompare(a.createdAt));
}

export async function listOfficers() {
  await connectDb();
  const role = await Role.findOne({ name: "maintenance_officer" }).select("_id").lean();
  if (!role) return [];
  const officers = await User.find({ roleId: role._id, isActive: true }).select("name email").sort({ name: 1 }).lean();
  return (officers as LeanPerson[]).map((officer) => ({ id: String(officer._id), name: officer.name ?? "", email: officer.email ?? "" }));
}
