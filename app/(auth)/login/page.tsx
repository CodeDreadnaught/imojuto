import Link from "next/link";
import { LoginForm } from "@/app/(auth)/login/login-form";

export default async function LoginPage(props: { searchParams: Promise<{ callbackUrl?: string; registered?: string }> }) {
  const searchParams = await props.searchParams;
  const callbackUrl = searchParams.callbackUrl ?? "/dashboard";
  const registered = searchParams.registered === "1";

  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="font-serif text-3xl font-semibold text-stone-950">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">Access request tracking, officer queues, and administrator tools.</p>
        <div className="mt-6">
          <LoginForm callbackUrl={callbackUrl} registered={registered} />
        </div>
        <p className="mt-6 text-sm text-stone-600">
          New student or staff member?{" "}
          <Link href="/register" className="font-medium text-emerald-800 hover:text-emerald-900">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
