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
  low: "border border-stone-300 bg-stone-100 text-stone-700",
  medium: "border border-teal-200 bg-teal-50 text-teal-900",
  high: "border border-orange-200 bg-orange-50 text-orange-900",
  urgent: "border border-red-200 bg-red-50 text-red-900",
} satisfies Record<RequestPriority, string>;

type PriorityBadgeProps = {
  priority: RequestPriority;
  className?: string;
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return <Badge className={cn(priorityStyles[priority], className)}>{priorityLabels[priority]}</Badge>;
}
