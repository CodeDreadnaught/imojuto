import { StatusBadge, type RequestStatus } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";

type TimelineItem = {
  id: string;
  actor: string;
  fromStatus?: RequestStatus;
  toStatus: RequestStatus;
  note: string;
  createdAt: string;
};

export function StatusTimeline({ logs }: { logs: TimelineItem[] }) {
  return (
    <ol className="space-y-4">
      {logs.map((log) => (
        <li key={log.id} className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <StatusBadge status={log.toStatus} />
              <span className="text-sm font-medium text-stone-950">{log.actor}</span>
            </div>
            <time className="text-xs text-stone-500">{formatDate(log.createdAt)}</time>
          </div>
          {log.note ? <p className="mt-3 text-sm leading-6 text-stone-600">{log.note}</p> : null}
        </li>
      ))}
    </ol>
  );
}
