import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { requestStatuses } from "@/models/serviceRequest";

export type RequestStatus = (typeof requestStatuses)[number];

export const statusLabels = {
  submitted: "Submitted",
  assigned: "Assigned",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
  reopened: "Reopened",
} satisfies Record<RequestStatus, string>;

export const statusStyles = {
  submitted: "border border-cyan-200 bg-cyan-50 text-cyan-900",
  assigned: "border border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900",
  in_progress: "border border-amber-200 bg-amber-50 text-amber-900",
  resolved: "border border-emerald-200 bg-emerald-50 text-emerald-900",
  closed: "border border-stone-300 bg-stone-200 text-stone-800",
  reopened: "border border-rose-200 bg-rose-50 text-rose-900",
} satisfies Record<RequestStatus, string>;

type StatusBadgeProps = {
  status: RequestStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return <Badge className={cn(statusStyles[status], className)}>{statusLabels[status]}</Badge>;
}
