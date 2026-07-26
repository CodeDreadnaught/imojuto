import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { listOfficerQueue } from "@/actions/serviceRequests";
import { StatusUpdateForm } from "@/components/officer/StatusUpdateForm";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { PollingRefresh } from "@/components/shared/PollingRefresh";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OfficerQueuePage() {
  const requests = await listOfficerQueue();

  return (
    <div>
      <PollingRefresh />
      <PageHeader title="Officer Queue" description="Assigned maintenance work sorted with urgent requests first." />
      {requests.length ? (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-emerald-800">{request.referenceCode}</p>
                  <CardTitle className="mt-1">{request.title}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-2">
                  <PriorityBadge priority={request.priority} />
                  <StatusBadge status={request.status} />
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-[1fr_300px]">
                <p className="text-sm leading-6 text-stone-600">{request.description}</p>
                <div className="grid gap-3">
                  <StatusUpdateForm requestId={request.id} />
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/requests/${request.id}`}>Open detail</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={ClipboardList} title="No active assignments" description="Assigned and reopened work will appear here automatically." />
      )}
    </div>
  );
}
