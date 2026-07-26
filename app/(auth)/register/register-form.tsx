"use client";

import { useActionState } from "react";
import { UserPlus } from "@phosphor-icons/react";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

type AuthActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const initialState: AuthActionState = { ok: false, message: "" };

function FieldError({ messages }: { messages?: string[] }) {
  return messages?.length ? <p className="text-xs font-medium text-red-700">{messages[0]}</p> : null;
}

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerUser, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" autoComplete="name" required />
        <FieldError messages={state.fieldErrors?.name} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        <FieldError messages={state.fieldErrors?.email} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput id="password" name="password" autoComplete="new-password" required />
        <FieldError messages={state.fieldErrors?.password} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="department">Department or hostel</Label>
          <Input id="department" name="department" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" />
        </div>
      </div>
      {state.message ? <p className="text-sm text-red-700">{state.message}</p> : null}
      <Button type="submit" disabled={pending}>
        <UserPlus className="h-4 w-4" weight="duotone" aria-hidden="true" />
        {pending ? "Creating account" : "Create account"}
      </Button>
    </form>
  );
}
