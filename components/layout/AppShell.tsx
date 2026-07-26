import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { navItems, type RoleName } from "@/config/nav";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/shared/NotificationBell";

type AppShellProps = {
  children: React.ReactNode;
  role?: RoleName;
};

export function AppShell({ children, role = "student_staff" }: AppShellProps) {
  const items = navItems[role];
  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-emerald-800 text-white">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-serif text-xl font-semibold text-stone-950">Imojuto</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 hover:text-stone-950",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
          <NotificationBell />
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="hidden lg:block">
          <nav className="sticky top-24 flex flex-col gap-1" aria-label="Sidebar navigation">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-white hover:text-stone-950 hover:shadow-sm"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
