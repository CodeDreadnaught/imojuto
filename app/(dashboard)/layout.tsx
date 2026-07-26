import { AppShell } from "@/components/layout/AppShell";
import { getSession } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const permissions = session?.user?.permissions ?? [];
  const role = permissions.includes("request:assign")
    ? "admin"
    : permissions.includes("request:update_status")
      ? "maintenance_officer"
      : "student_staff";

  return <AppShell role={role}>{children}</AppShell>;
}
