import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { requestPriorities } from "@/models/serviceRequest";

export type RequestPriority = (typeof requestPriorities)[number];

export const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
} satisfies Record<RequestPriority, string>;

export const priorityStyles = {
  low: "border border-[#d8cebe] bg-[#f1ebe1] text-[#655c50]",
  medium: "border border-[#b9d8c7] bg-[#e6f2eb] text-[#1d4f43]",
  high: "border border-[#efc694] bg-[#fff0dc] text-[#8a4d12]",
  urgent: "border border-[#eaa9a9] bg-[#fff0f0] text-[#9f2f2f]",
} satisfies Record<RequestPriority, string>;

type PriorityBadgeProps = {
  priority: RequestPriority;
  className?: string;
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return <Badge className={cn(priorityStyles[priority], className)}>{priorityLabels[priority]}</Badge>;
}
