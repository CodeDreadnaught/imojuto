import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-4">
      <section className="max-w-md rounded-lg border border-stone-200 bg-white p-6 text-center shadow-sm">
        <ShieldAlert className="mx-auto h-10 w-10 text-red-700" aria-hidden="true" />
        <h1 className="mt-4 font-serif text-3xl font-semibold text-stone-950">Access denied</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">Your account does not have permission to open this area.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Return to dashboard</Link>
        </Button>
      </section>
    </main>
  );
}
