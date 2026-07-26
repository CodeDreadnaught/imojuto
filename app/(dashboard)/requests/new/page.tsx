import { RequestForm } from "@/app/(dashboard)/requests/new/RequestForm";
import { getActiveCategories } from "@/actions/serviceRequests";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function NewRequestPage() {
  const categories = await getActiveCategories();

  return (
    <div>
      <PageHeader title="New Request" description="Submit a maintenance issue with the details officers need to triage and resolve it." />
      <RequestForm categories={categories} />
    </div>
  );
}
