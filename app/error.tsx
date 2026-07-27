"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowClockwise, House, WarningDiamond } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-12 text-[#27241f]">
      <section className="panel-enter w-full max-w-2xl rounded-lg border border-[#ded5c5] bg-[#fffaf1] p-6 text-center shadow-[0_24px_90px_rgba(39,36,31,0.1)] sm:p-8">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#f6ded9] text-[#9f2f2f]">
          <WarningDiamond className="h-8 w-8" weight="duotone" aria-hidden="true" />
        </span>
        <p className="mt-5 text-sm font-semibold uppercase text-[#8a7a67]">Unexpected error</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#27241f] sm:text-4xl">
          Something interrupted this workspace.
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#655c50]">
          Try reloading this view. If it keeps happening, return to the dashboard and continue from there.
        </p>
        {error.digest ? <p className="mt-4 text-xs text-[#8a7a67]">Reference: {error.digest}</p> : null}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={() => unstable_retry()}>
            <ArrowClockwise className="h-4 w-4" weight="duotone" aria-hidden="true" />
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              <House className="h-4 w-4" weight="duotone" aria-hidden="true" />
              Dashboard
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
