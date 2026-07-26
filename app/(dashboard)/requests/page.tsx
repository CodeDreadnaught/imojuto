import { ClipboardList } from "lucide-react";
import { listMyRequests } from "@/actions/serviceRequests";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { PollingRefresh } from "@/components/shared/PollingRefresh";
import { RequestTable } from "@/components/requests/RequestTable";

export default async function RequestsPage(props: {
  searchParams: Promise<{ status?: string; categoryId?: string; search?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const data = await listMyRequests({
    status: searchParams.status,
    categoryId: searchParams.categoryId,
    search: searchParams.search,
    page: Number(searchParams.page ?? "1"),
  });

  return (
    <div>
      <PollingRefresh />
      <PageHeader title="My Requests" description="Track submitted requests by reference, status, category, and timeline evidence." />
      {data.items.length ? (
        <RequestTable requests={data.items} />
      ) : (
        <EmptyState icon={ClipboardList} title="No requests found" description="Submit a new request or adjust filters to see previous maintenance issues." />
      )}
    </div>
  );
}
