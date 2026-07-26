import Link from "next/link";
import { AssignOfficerDialog } from "@/components/admin/AssignOfficerDialog";
import { PriorityBadge, type RequestPriority } from "@/components/shared/PriorityBadge";
import { StatusBadge, type RequestStatus } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type RequestRow = {
  id: string;
  referenceCode: string;
  title: string;
  requester: string;
  category: string;
  priority: RequestPriority;
  status: RequestStatus;
};

type Officer = {
  id: string;
  name: string;
  email: string;
};

export function RequestOverviewTable({ requests, officers }: { requests: RequestRow[]; officers: Officer[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reference</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Requester</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-semibold text-[#27241f]">{request.referenceCode}</TableCell>
            <TableCell>{request.title}</TableCell>
            <TableCell>{request.requester}</TableCell>
            <TableCell>
              <PriorityBadge priority={request.priority} />
            </TableCell>
            <TableCell>
              <StatusBadge status={request.status} />
            </TableCell>
            <TableCell className="flex justify-end gap-2">
              <AssignOfficerDialog requestId={request.id} officers={officers} />
              <Button asChild size="sm" variant="ghost">
                <Link href={`/requests/${request.id}`}>Open</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
