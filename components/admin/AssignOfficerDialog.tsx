"use client";

import { useActionState } from "react";
import { UserRoundCheck } from "lucide-react";
import { assignOfficer } from "@/actions/assignments";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Officer = {
  id: string;
  name: string;
  email: string;
};

const initialState = { ok: false, message: "" };

export function AssignOfficerDialog({ requestId, officers }: { requestId: string; officers: Officer[] }) {
  const [state, formAction, pending] = useActionState(assignOfficer, initialState);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <UserRoundCheck className="h-4 w-4" aria-hidden="true" />
          Assign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign officer</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          <input type="hidden" name="requestId" value={requestId} />
          <Select name="officerId" required>
            <SelectTrigger>
              <SelectValue placeholder="Choose officer" />
            </SelectTrigger>
            <SelectContent>
              {officers.map((officer) => (
                <SelectItem key={officer.id} value={officer.id}>
                  {officer.name} ({officer.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea name="notes" placeholder="Assignment notes" className="min-h-20" />
          {state.message ? <p className={state.ok ? "text-sm text-emerald-800" : "text-sm text-red-700"}>{state.message}</p> : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Assigning" : "Assign officer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
