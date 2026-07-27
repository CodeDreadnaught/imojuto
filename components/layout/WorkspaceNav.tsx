"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellRinging,
  ClipboardText,
  Folders,
  Gauge,
  ListChecks,
  PlusCircle,
  SlidersHorizontal,
  UsersThree,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { navItems, type NavIconName, type RoleName } from "@/config/nav";
import { cn } from "@/lib/utils";

const icons: Record<NavIconName, Icon> = {
  BellRinging,
  ClipboardText,
  Folders,
  Gauge,
  ListChecks,
  PlusCircle,
  SlidersHorizontal,
  UsersThree,
};

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function getActiveHref(pathname: string, role: RoleName) {
  return navItems[role]
    .filter((item) => isActivePath(pathname, item.href))
    .sort((first, second) => second.href.length - first.href.length)[0]?.href;
}

export function WorkspaceSideNav({ role }: { role: RoleName }) {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname, role);

  return (
    <nav className="flex flex-col gap-1" aria-label="Sidebar navigation">
      {navItems[role].map((item) => {
        const Icon = icons[item.icon];
        const active = activeHref === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-[#655c50] transition hover:bg-white hover:text-[#27241f] hover:shadow-sm",
              active && "bg-white text-[#1d4f43] shadow-sm ring-1 ring-[#c8dbd0]",
            )}
          >
            <span
              className={cn(
                "grid h-7 w-7 place-items-center rounded-md bg-[#efe8dc] text-[#655c50] transition",
                active && "bg-[#e6f2eb] text-[#1d4f43]",
              )}
            >
              <Icon className="h-4 w-4" weight={active ? "fill" : "duotone"} aria-hidden="true" />
            </span>
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

export function WorkspaceMobileNav({ role }: { role: RoleName }) {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname, role);
  const items = navItems[role];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#ded5c5] bg-[#fffaf1]/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_60px_rgba(39,36,31,0.08)] backdrop-blur-xl lg:hidden"
      aria-label="Mobile navigation"
    >
      <div
        className="mx-auto grid w-full max-w-[720px] gap-1"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const Icon = icons[item.icon];
          const active = activeHref === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.title}
              aria-current={active ? "page" : undefined}
              className={cn(
                "grid h-12 min-w-0 place-items-center rounded-lg px-1.5 text-[#655c50] transition hover:bg-[#efe8dc] hover:text-[#27241f]",
                active && "bg-[#1d4f43] text-[#fffaf1] shadow-sm shadow-emerald-950/10 hover:bg-[#1d4f43] hover:text-[#fffaf1]",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" weight={active ? "fill" : "duotone"} aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
