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
  submitted: "border border-[#b7dbe5] bg-[#e8f6f8] text-[#164f5a]",
  assigned: "border border-[#d8c6ec] bg-[#f2eafa] text-[#553073]",
  in_progress: "border border-[#ead099] bg-[#fff4d6] text-[#765315]",
  resolved: "border border-[#b9d8c7] bg-[#e6f2eb] text-[#1d4f43]",
  closed: "border border-[#d8cebe] bg-[#e8e1d6] text-[#5c5449]",
  reopened: "border border-[#edc3c9] bg-[#fff0f2] text-[#8b2e3b]",
} satisfies Record<RequestStatus, string>;

type StatusBadgeProps = {
  status: RequestStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return <Badge className={cn(statusStyles[status], className)}>{statusLabels[status]}</Badge>;
}
