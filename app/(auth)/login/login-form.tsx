"use client";

import { useActionState } from "react";
import { SignIn } from "@phosphor-icons/react";
import { loginUser } from "@/actions/auth";
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

export function LoginForm({ callbackUrl, registered }: { callbackUrl: string; registered: boolean }) {
  const [state, formAction, pending] = useActionState(loginUser, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      {registered ? <p className="rounded-md bg-[#e6f2eb] px-3 py-2 text-sm font-semibold text-[#1d4f43]">Account created. Sign in to continue.</p> : null}
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        <FieldError messages={state.fieldErrors?.email} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput id="password" name="password" autoComplete="current-password" required />
        <FieldError messages={state.fieldErrors?.password} />
      </div>
      {state.message ? <p className={state.ok ? "text-sm font-semibold text-[#1d4f43]" : "text-sm text-red-700"}>{state.message}</p> : null}
      <Button type="submit" disabled={pending}>
        <SignIn className="h-4 w-4" weight="duotone" aria-hidden="true" />
        {pending ? "Signing in" : "Sign in"}
      </Button>
    </form>
  );
}
