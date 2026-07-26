import { Badge } from "@/components/ui/badge";

const priorityStyles = {
  low: "bg-stone-100 text-stone-700",
  medium: "bg-teal-100 text-teal-950",
  high: "bg-orange-100 text-orange-950",
  urgent: "bg-red-100 text-red-950",
};

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export type RequestPriority = keyof typeof priorityStyles;

export function PriorityBadge({ priority }: { priority: RequestPriority }) {
  return <Badge className={priorityStyles[priority]}>{priorityLabels[priority]}</Badge>;
}
