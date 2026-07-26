import Link from "next/link";
import { ArrowLeft, Compass, House } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f4ef] px-4 py-12">
      <section className="w-full max-w-2xl rounded-2xl border border-[#ded5c5] bg-[#fffaf1] p-8 text-center shadow-[0_24px_100px_rgba(39,36,31,0.12)]">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-xl bg-[#e6f2eb] text-[#1d4f43]">
          <Compass className="h-8 w-8" weight="duotone" aria-hidden="true" />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase text-[#8a7a67]">404</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#27241f]">This page is not on the board</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#655c50]">
          The route may have moved, or the request view you opened is no longer available from this session.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/dashboard">
              <House className="h-4 w-4" weight="duotone" aria-hidden="true" />
              Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" weight="duotone" aria-hidden="true" />
              Home
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
