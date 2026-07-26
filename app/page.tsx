import Link from "next/link";
import {
  ArrowRight,
  BellRinging,
  Buildings,
  CalendarCheck,
  ChartLineUp,
  CheckCircle,
  ClipboardText,
  Gauge,
  ShieldCheckered,
  Sparkle,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Icon } from "@phosphor-icons/react/dist/lib/types";

const featureCards: { icon: Icon; title: string; description: string }[] = [
  {
    icon: ClipboardText,
    title: "Capture",
    description:
      "Requests include category, priority, location, and evidence from the start.",
  },
  {
    icon: Wrench,
    title: "Assign",
    description:
      "Administrators route work to active officers with an auditable trail.",
  },
  {
    icon: BellRinging,
    title: "Notify",
    description:
      "Requesters and teams stay aligned through in-app and email updates.",
  },
];

const requestRows = [
  ["Electrical fault", "Hall B, Level 2", "Urgent", "Assigned"],
  ["Water leak", "Science Block", "High", "In progress"],
  ["Broken fixture", "Library entrance", "Medium", "Submitted"],
];

const metrics = [
  { icon: CalendarCheck, label: "Today", value: "12 updates" },
  { icon: ChartLineUp, label: "SLA", value: "86% on track" },
  { icon: CheckCircle, label: "Resolved", value: "34 this week" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f4ef] text-[#27241f]">
      <section className="border-b border-[#ded5c5] bg-[#fffaf1]">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <nav className="page-enter flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#1d4f43] text-[#fffaf1] shadow-[0_14px_35px_rgba(29,79,67,0.22)]">
                <ShieldCheckered
                  className="h-6 w-6"
                  weight="duotone"
                  aria-hidden="true"
                />
              </span>
              <span className="text-base font-semibold tracking-normal">
                Imojuto
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Create account</Link>
              </Button>
            </div>
          </nav>

          <div className="grid flex-1 content-center gap-10 py-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(460px,1fr)] lg:items-center lg:py-8">
            <div className="page-enter max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c8dbd0] bg-[#e6f2eb] px-4 py-2 text-sm font-semibold text-[#1d4f43]">
                <Buildings
                  className="h-4 w-4"
                  weight="duotone"
                  aria-hidden="true"
                />
                University Maintenance Operations
              </div>
              <h1 className="max-w-2xl text-5xl font-semibold leading-[0.98] tracking-normal text-[#27241f] sm:text-6xl lg:text-7xl">
                Imojuto
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#655c50]">
                A premium service desk for campus faults, maintenance
                assignments, status trails, notifications, and administrator
                reporting.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/login">
                    Open workspace
                    <ArrowRight
                      className="h-4 w-4"
                      weight="duotone"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/register">Submit first request</Link>
                </Button>
              </div>
              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                {[
                  ["Roles", "3"],
                  ["Statuses", "6"],
                  ["Refresh", "15s"],
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className={`panel-enter rounded-lg border border-[#ded5c5] bg-white/70 px-4 py-3 ${
                      index === 1 ? "delay-1" : index === 2 ? "delay-2" : ""
                    }`}
                  >
                    <p className="text-2xl font-semibold text-[#27241f]">
                      {value}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold uppercase text-[#8a7a67]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-enter delay-1">
              <div className="rounded-[10px] border border-[#d8cebd] bg-[#efe8dc] p-2 shadow-[0_34px_90px_rgba(39,36,31,0.16)]">
                <Card className="relative overflow-hidden border-[#2e5d51] bg-[#1d4f43] text-[#fffaf1] shadow-none">
                  <div className="queue-scan pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#cfe4d8]">
                          Operations command
                        </p>
                        <h2 className="mt-2 max-w-sm text-2xl font-semibold leading-tight">
                          Urgent campus work, routed without guesswork.
                        </h2>
                      </div>
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/12">
                        <Gauge
                          className="h-7 w-7"
                          weight="duotone"
                          aria-hidden="true"
                        />
                      </span>
                    </div>

                    <div className="mt-6 grid gap-3 rounded-lg border border-white/10 bg-black/10 p-3">
                      {requestRows.map(
                        ([title, location, priority, status]) => (
                          <div
                            key={title}
                            className="grid gap-3 rounded-lg border border-white/10 bg-white/8 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                          >
                            <div>
                              <p className="font-semibold">{title}</p>
                              <p className="mt-1 text-sm text-[#dbe9df]">
                                {location}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold">
                              <span className="rounded-md bg-[#e7c46f] px-2.5 py-1 text-[#27241f]">
                                {priority}
                              </span>
                              <span className="rounded-md bg-white/12 px-2.5 py-1 text-[#fffaf1]">
                                {status}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {metrics.map(({ icon: Icon, label, value }) => (
                        <div
                          key={label}
                          className="rounded-lg border border-white/10 bg-white/8 p-3"
                        >
                          <Icon
                            className="h-5 w-5 text-[#e7c46f]"
                            weight="duotone"
                            aria-hidden="true"
                          />
                          <p className="mt-2 text-sm font-semibold">{value}</p>
                          <p className="text-xs text-[#cfe4d8]">{label}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="grid gap-3 pb-7 sm:grid-cols-3">
            {featureCards.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="panel-enter delay-2 bg-white/78 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_90px_rgba(39,36,31,0.1)]"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#e6f2eb] text-[#1d4f43]">
                      <Icon
                        className="h-5 w-5"
                        weight="duotone"
                        aria-hidden="true"
                      />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-[#27241f]">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-[#655c50]">
                        {description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f4ef] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1fr] lg:items-start">
          <div className="panel-enter">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ded5c5] bg-white px-3 py-1.5 text-xs font-semibold uppercase text-[#8a7a67]">
              <Sparkle
                className="h-4 w-4 text-[#b8872f]"
                weight="duotone"
                aria-hidden="true"
              />
              Premium workflow
            </div>
            <h2 className="mt-5 max-w-md text-3xl font-semibold leading-tight text-[#27241f] sm:text-4xl">
              Designed for the teams who keep campus running.
            </h2>
          </div>
          <div className="grid gap-3">
            {[
              [
                "Requester confidence",
                "Students and staff can submit issues and follow progress without chasing office updates.",
              ],
              [
                "Administrative control",
                "Admins manage users, categories, assignments, exports, and audit evidence from one workspace.",
              ],
              [
                "Officer clarity",
                "Maintenance officers receive focused queues and update each request with clear status movement.",
              ],
            ].map(([title, description]) => (
              <div
                key={title}
                className="panel-enter rounded-lg border border-[#ded5c5] bg-white/75 p-5 transition duration-300 hover:border-[#c8dbd0] hover:bg-white"
              >
                <h3 className="font-semibold text-[#27241f]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#655c50]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
