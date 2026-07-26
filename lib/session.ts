import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function getSession() {
  return auth();
}

export async function requireSession() {
  const session = await auth();

  if (!session?.user?.userId) {
    redirect("/login");
  }

  return session;
}

export async function requirePermission(permission: string) {
  const session = await requireSession();

  if (!session.user.permissions.includes(permission)) {
    redirect("/403");
  }

  return session;
}
