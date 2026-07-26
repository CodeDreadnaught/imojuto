import Link from "next/link";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { listActivity } from "@/actions/activityLog";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default async function ActivityPage() {
  const rows = await listActivity();

  return (
    <div>
      <PageHeader
        title="Activity Log"
        description="Review status changes and assignment history across all service requests."
        actions={
          <Button asChild variant="outline">
            <Link href="/api/activity/export">
              <DownloadSimple className="h-4 w-4" weight="duotone" aria-hidden="true" />
              Export CSV
            </Link>
          </Button>
        }
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actor</TableHead>
            <TableHead>Request</TableHead>
            <TableHead>Detail</TableHead>
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={`${row.type}-${row.id}`}>
              <TableCell>{formatDate(row.createdAt)}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.actor}</TableCell>
              <TableCell>{row.request}</TableCell>
              <TableCell>{row.detail}</TableCell>
              <TableCell>{row.note}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
