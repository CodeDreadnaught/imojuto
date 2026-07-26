import type { Icon } from "@phosphor-icons/react";
import {
  BellRinging,
  ClipboardText,
  Folders,
  Gauge,
  ListChecks,
  PlusCircle,
  SlidersHorizontal,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

export type RoleName = "student_staff" | "maintenance_officer" | "admin";

export type NavItem = {
  title: string;
  href: string;
  icon: Icon;
};

export const navItems: Record<RoleName, NavItem[]> = {
  student_staff: [
    { title: "Overview", href: "/dashboard", icon: Gauge },
    { title: "My Requests", href: "/requests", icon: ClipboardText },
    { title: "New Request", href: "/requests/new", icon: PlusCircle },
    { title: "Notifications", href: "/notifications", icon: BellRinging },
  ],
  maintenance_officer: [
    { title: "Queue", href: "/officer", icon: Folders },
    { title: "Notifications", href: "/notifications", icon: BellRinging },
  ],
  admin: [
    { title: "Overview", href: "/admin/requests", icon: ClipboardText },
    { title: "Categories", href: "/admin/categories", icon: SlidersHorizontal },
    { title: "Users", href: "/admin/users", icon: UsersThree },
    { title: "Activity", href: "/admin/activity", icon: ListChecks },
    { title: "Notifications", href: "/notifications", icon: BellRinging },
  ],
};
