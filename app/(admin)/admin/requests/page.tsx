import { listAllRequests, listOfficers } from "@/actions/serviceRequests";
import { RequestOverviewTable } from "@/components/admin/RequestOverviewTable";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function AdminRequestsPage(props: {
  searchParams: Promise<{ status?: string; categoryId?: string; priority?: string; officerId?: string; search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const [requests, officers] = await Promise.all([listAllRequests(searchParams), listOfficers()]);

  return (
    <div>
      <PageHeader title="Request Overview" description="Monitor all requests, prioritize urgent work, and assign active officers." />
      <RequestOverviewTable requests={requests} officers={officers} />
    </div>
  );
}
