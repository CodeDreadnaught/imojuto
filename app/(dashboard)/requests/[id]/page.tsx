import { notFound } from "next/navigation";
import { reopenRequest, getRequestDetail } from "@/actions/serviceRequests";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatusTimeline } from "@/components/requests/StatusTimeline";
import { PollingRefresh } from "@/components/shared/PollingRefresh";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function RequestDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const detail = await getRequestDetail(id);
  if (!detail) {
    notFound();
  }

  const { request, logs, assignments, canReopen } = detail;

  return (
    <div className="grid gap-6">
      <PollingRefresh />
      <div className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-800">{request.referenceCode}</p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-stone-950">{request.title}</h1>
          <p className="mt-2 text-sm text-stone-600">{request.category}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PriorityBadge priority={request.priority} />
          <StatusBadge status={request.status} />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-stone-700">{request.description}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Status timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline logs={logs} />
            </CardContent>
          </Card>
        </section>
        <aside className="grid content-start gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-stone-700">
              <p>{request.location.building}</p>
              <p>{request.location.roomOrArea}</p>
              {request.location.notes ? <p>{request.location.notes}</p> : null}
              <p className="mt-3 text-stone-500">Created {formatDate(request.createdAt)}</p>
            </CardContent>
          </Card>
          {assignments.length ? (
            <Card>
              <CardHeader>
                <CardTitle>Assignments</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="rounded-md border border-stone-200 p-3 text-sm">
                    <p className="font-medium text-stone-950">{assignment.officer}</p>
                    <p className="text-stone-600">Assigned by {assignment.assignedBy}</p>
                    <p className="text-stone-500">{formatDate(assignment.assignedAt)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
          {canReopen && ["resolved", "closed"].includes(request.status) ? (
            <form action={reopenRequest}>
              <input type="hidden" name="requestId" value={request.id} />
              <Button type="submit" variant="outline" className="w-full">
                Reopen request
              </Button>
            </form>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
