import Link from "next/link";
import { ArrowRight, Building2, ClipboardCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid min-h-[88vh] max-w-7xl content-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div className="max-w-3xl self-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-emerald-900/15 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-900">
              <Building2 className="h-4 w-4" aria-hidden="true" />
              University maintenance operations
            </div>
            <h1 className="font-serif text-5xl font-semibold tracking-normal text-stone-950 sm:text-6xl">
              Imojuto
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-650">
              A single request desk for campus faults, officer assignments, status tracking, audit evidence, and administrator reports.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/login">
                  Sign in
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/register">Create account</Link>
              </Button>
            </div>
          </div>
          <div className="grid content-end gap-4">
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-6 w-6 text-emerald-800" aria-hidden="true" />
                <h2 className="text-base font-semibold text-stone-950">Traceable requests</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Each maintenance issue moves from submission through assignment, progress, resolution, and closure with a visible timeline.
              </p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
              <div className="flex items-center gap-3">
                <Wrench className="h-6 w-6 text-amber-700" aria-hidden="true" />
                <h2 className="text-base font-semibold text-stone-950">Officer queues</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Urgent work appears first, officers update progress from mobile screens, and administrators keep the full operational view.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
