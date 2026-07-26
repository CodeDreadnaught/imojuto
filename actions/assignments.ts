"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { requireCapability } from "@/lib/rbac";
import { requireSession } from "@/lib/session";
import { Assignment, ServiceRequest, StatusLog } from "@/models";

type AssignmentActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const assignmentSchema = z.object({
  requestId: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), "Request id is invalid."),
  officerId: z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), "Choose an officer."),
  notes: z.string().trim().max(500).optional(),
});

export async function assignOfficer(_state: AssignmentActionState, formData: FormData): Promise<AssignmentActionState> {
  const session = await requireSession();
  requireCapability(session, "request:assign");

  const parsed = assignmentSchema.safeParse({
    requestId: formData.get("requestId"),
    officerId: formData.get("officerId"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check assignment details and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await connectDb();

  const request = await ServiceRequest.findById(parsed.data.requestId);
  if (!request) {
    return { ok: false, message: "Request was not found." };
  }

  await Assignment.updateMany(
    { serviceRequestId: request._id, isActive: true },
    { isActive: false, unassignedAt: new Date() },
  );

  await Assignment.create({
    serviceRequestId: request._id,
    officerId: parsed.data.officerId,
    assignedById: session.user.userId,
    assignedAt: new Date(),
    isActive: true,
    notes: parsed.data.notes,
  });

  const fromStatus = request.status;
  request.status = "assigned";
  await request.save();

  await StatusLog.create({
    serviceRequestId: request._id,
    actorId: session.user.userId,
    fromStatus,
    toStatus: "assigned",
    note: parsed.data.notes || "Officer assigned.",
  });

  revalidatePath("/admin/requests");
  revalidatePath("/officer");
  revalidatePath(`/requests/${request._id}`);
  return { ok: true, message: "Officer assigned." };
}
