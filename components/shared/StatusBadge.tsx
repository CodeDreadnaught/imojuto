import { Badge } from "@/components/ui/badge";

const statusStyles = {
  submitted: "bg-sky-100 text-sky-950",
  assigned: "bg-violet-100 text-violet-950",
  in_progress: "bg-amber-100 text-amber-950",
  resolved: "bg-emerald-100 text-emerald-950",
  closed: "bg-stone-200 text-stone-800",
  reopened: "bg-rose-100 text-rose-950",
};

const statusLabels = {
  submitted: "Submitted",
  assigned: "Assigned",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
  reopened: "Reopened",
};

export type RequestStatus = keyof typeof statusStyles;

export function StatusBadge({ status }: { status: RequestStatus }) {
  return <Badge className={statusStyles[status]}>{statusLabels[status]}</Badge>;
}
