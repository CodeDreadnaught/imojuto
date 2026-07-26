"use server";

import { connectDb } from "@/lib/db";
import { requireCapability } from "@/lib/rbac";
import { requireSession } from "@/lib/session";
import { Assignment, StatusLog } from "@/models";

export async function listActivity(filters?: { actorId?: string; requestId?: string }) {
  const session = await requireSession();
  requireCapability(session, "activity:read");
  await connectDb();

  const statusQuery: Record<string, unknown> = {};
  if (filters?.actorId) statusQuery.actorId = filters.actorId;
  if (filters?.requestId) statusQuery.serviceRequestId = filters.requestId;

  const [logs, assignments] = await Promise.all([
    StatusLog.find(statusQuery)
      .populate("actorId", "name email")
      .populate("serviceRequestId", "referenceCode title")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean(),
    Assignment.find(filters?.requestId ? { serviceRequestId: filters.requestId } : {})
      .populate("assignedById", "name email")
      .populate("officerId", "name email")
      .populate("serviceRequestId", "referenceCode title")
      .sort({ assignedAt: -1 })
      .limit(100)
      .lean(),
  ]);

  const statusRows = logs.map((log) => ({
    id: String(log._id),
    type: "Status change",
    actor: typeof log.actorId === "object" && log.actorId && "name" in log.actorId ? String(log.actorId.name) : "System",
    request:
      typeof log.serviceRequestId === "object" && log.serviceRequestId && "referenceCode" in log.serviceRequestId
        ? String(log.serviceRequestId.referenceCode)
        : String(log.serviceRequestId),
    detail: `${log.fromStatus ?? "new"} to ${log.toStatus}`,
    note: log.note ?? "",
    createdAt: log.createdAt?.toISOString?.() ?? new Date().toISOString(),
  }));

  const assignmentRows = assignments.map((assignment) => ({
    id: String(assignment._id),
    type: "Assignment",
    actor:
      typeof assignment.assignedById === "object" && assignment.assignedById && "name" in assignment.assignedById
        ? String(assignment.assignedById.name)
        : "System",
    request:
      typeof assignment.serviceRequestId === "object" && assignment.serviceRequestId && "referenceCode" in assignment.serviceRequestId
        ? String(assignment.serviceRequestId.referenceCode)
        : String(assignment.serviceRequestId),
    detail:
      typeof assignment.officerId === "object" && assignment.officerId && "name" in assignment.officerId
        ? `Assigned to ${String(assignment.officerId.name)}`
        : "Assigned",
    note: assignment.notes ?? "",
    createdAt: assignment.assignedAt?.toISOString?.() ?? new Date().toISOString(),
  }));

  return [...statusRows, ...assignmentRows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
