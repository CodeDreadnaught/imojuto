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
        <li key={log.id} className="rounded-lg border border-[#ded5c5] bg-white/85 p-4 transition duration-300 hover:border-[#c8dbd0]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <StatusBadge status={log.toStatus} />
              <span className="text-sm font-semibold text-[#27241f]">{log.actor}</span>
            </div>
            <time className="text-xs text-[#8a7a67]">{formatDate(log.createdAt)}</time>
          </div>
          {log.note ? <p className="mt-3 text-sm leading-6 text-[#655c50]">{log.note}</p> : null}
        </li>
      ))}
    </ol>
  );
}
