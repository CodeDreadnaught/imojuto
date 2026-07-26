"use client";

import { useActionState } from "react";
import { CheckCircle } from "lucide-react";
import { updateRequestStatus } from "@/actions/serviceRequests";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState = { ok: false, message: "" };

export function StatusUpdateForm({ requestId }: { requestId: string }) {
  const [state, formAction, pending] = useActionState(updateRequestStatus, initialState);

  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="requestId" value={requestId} />
      <Select name="toStatus" defaultValue="in_progress">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="in_progress">In progress</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
        </SelectContent>
      </Select>
      <Textarea name="note" placeholder="Work note" className="min-h-20" />
      {state.message ? <p className={state.ok ? "text-xs text-emerald-800" : "text-xs text-red-700"}>{state.message}</p> : null}
      <Button type="submit" size="sm" disabled={pending}>
        <CheckCircle className="h-4 w-4" aria-hidden="true" />
        {pending ? "Updating" : "Update status"}
      </Button>
    </form>
  );
}
