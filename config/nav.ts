import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bell,
  ClipboardList,
  FolderKanban,
  Home,
  PlusCircle,
  Settings,
  Users,
} from "lucide-react";

export type RoleName = "student_staff" | "maintenance_officer" | "admin";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: Record<RoleName, NavItem[]> = {
  student_staff: [
    { title: "Overview", href: "/dashboard", icon: Home },
    { title: "My Requests", href: "/requests", icon: ClipboardList },
    { title: "New Request", href: "/requests/new", icon: PlusCircle },
    { title: "Notifications", href: "/notifications", icon: Bell },
  ],
  maintenance_officer: [
    { title: "Queue", href: "/officer", icon: FolderKanban },
    { title: "Notifications", href: "/notifications", icon: Bell },
  ],
  admin: [
    { title: "Overview", href: "/admin/requests", icon: ClipboardList },
    { title: "Categories", href: "/admin/categories", icon: Settings },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Activity", href: "/admin/activity", icon: Activity },
    { title: "Notifications", href: "/notifications", icon: Bell },
  ],
};
