import Link from "next/link";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { PriorityBadge, type RequestPriority } from "@/components/shared/PriorityBadge";
import { StatusBadge, type RequestStatus } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export type RequestRow = {
  id: string;
  referenceCode: string;
  title: string;
  category: string;
  priority: RequestPriority;
  status: RequestStatus;
  createdAt: string;
};

export function RequestTable({ requests }: { requests: RequestRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reference</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Open</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-semibold text-[#27241f]">{request.referenceCode}</TableCell>
            <TableCell>{request.title}</TableCell>
            <TableCell>{request.category}</TableCell>
            <TableCell>
              <PriorityBadge priority={request.priority} />
            </TableCell>
            <TableCell>
              <StatusBadge status={request.status} />
            </TableCell>
            <TableCell>{formatDate(request.createdAt)}</TableCell>
            <TableCell className="text-right">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/requests/${request.id}`}>
                  <ArrowSquareOut className="h-4 w-4" weight="duotone" aria-hidden="true" />
                  View
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
