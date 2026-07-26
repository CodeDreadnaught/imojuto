import Link from "next/link";
import { ClipboardText, PlusCircle } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await requireSession();
  const permissions = session.user.permissions;

  return (
    <div>
      <PageHeader title="Dashboard" description={`Signed in as ${session.user.name ?? session.user.email}.`} />
      <div className="grid gap-4 md:grid-cols-2">
        {permissions.includes("request:create") ? (
          <Card>
            <CardHeader>
              <CardTitle>Submit maintenance request</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-[#655c50]">Log a fault with location, priority, category, and evidence.</p>
              <Button asChild className="mt-4">
                <Link href="/requests/new">
                  <PlusCircle className="h-4 w-4" weight="duotone" aria-hidden="true" />
                  New request
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : null}
        <Card>
          <CardHeader>
            <CardTitle>Track work</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-[#655c50]">Open request lists, queues, and administrative views from the navigation.</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href={permissions.includes("request:update_status") ? "/officer" : "/requests"}>
                <ClipboardText className="h-4 w-4" weight="duotone" aria-hidden="true" />
                Open work
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
