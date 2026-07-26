import Link from "next/link";
import { SignOut, ShieldCheckered, SquaresFour } from "@phosphor-icons/react/dist/ssr";
import { signOutUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-[#f7f4ef] text-[#27241f]">
      <header className="sticky top-0 z-20 border-b border-[#ded5c5] bg-[#fffaf1]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#1d4f43] text-[#fffaf1] shadow-sm shadow-emerald-950/20">
              <ShieldCheckered className="h-5 w-5" weight="duotone" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-[#27241f]">Imojuto</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-[#655c50] transition hover:bg-[#efe8dc] hover:text-[#27241f]",
                  )}
                >
                  <Icon className="h-4 w-4" weight="duotone" aria-hidden="true" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <form action={signOutUser}>
              <Button type="submit" variant="ghost" size="sm" aria-label="Log out">
                <SignOut className="h-4 w-4" weight="duotone" aria-hidden="true" />
                <span className="hidden sm:inline">Log out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1480px] gap-7 px-4 py-6 sm:px-6 lg:grid-cols-[250px_1fr] lg:px-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-[#ded5c5] bg-[#fffaf1]/75 p-3 shadow-[0_18px_70px_rgba(39,36,31,0.06)] backdrop-blur">
            <div className="mb-3 flex items-center gap-2 px-2 py-2 text-xs font-semibold uppercase text-[#8a7a67]">
              <SquaresFour className="h-4 w-4" weight="duotone" aria-hidden="true" />
              Workspace
            </div>
            <nav className="flex flex-col gap-1" aria-label="Sidebar navigation">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-[#655c50] transition hover:bg-white hover:text-[#27241f] hover:shadow-sm"
                >
                  <Icon className="h-4 w-4" weight="duotone" aria-hidden="true" />
                  {item.title}
                </Link>
              );
            })}
            </nav>
            <form action={signOutUser} className="mt-4 border-t border-[#ded5c5] pt-3">
              <Button type="submit" variant="ghost" className="w-full justify-start text-[#655c50] hover:bg-white hover:text-[#27241f]">
                <SignOut className="h-4 w-4" weight="duotone" aria-hidden="true" />
                Log out
              </Button>
            </form>
          </div>
        </aside>
        <main className="page-enter min-w-0">{children}</main>
      </div>
    </div>
  );
}
