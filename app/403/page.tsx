import Link from "next/link";
import { ShieldWarning } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f4ef] px-4">
      <section className="max-w-md rounded-2xl border border-[#ded5c5] bg-[#fffaf1] p-8 text-center shadow-[0_24px_100px_rgba(39,36,31,0.12)]">
        <ShieldWarning className="mx-auto h-10 w-10 text-[#9f2f2f]" weight="duotone" aria-hidden="true" />
        <h1 className="mt-4 text-3xl font-semibold text-[#27241f]">Access denied</h1>
        <p className="mt-2 text-sm leading-6 text-[#655c50]">Your account does not have permission to open this area.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Return to dashboard</Link>
        </Button>
      </section>
    </main>
  );
}
