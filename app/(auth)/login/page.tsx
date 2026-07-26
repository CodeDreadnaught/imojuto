import Link from "next/link";
import { ArrowLeft, ShieldCheckered } from "@phosphor-icons/react/dist/ssr";
import { LoginForm } from "@/app/(auth)/login/login-form";
import { Button } from "@/components/ui/button";

export default async function LoginPage(props: { searchParams: Promise<{ callbackUrl?: string; registered?: string }> }) {
  const searchParams = await props.searchParams;
  const callbackUrl = searchParams.callbackUrl ?? "/dashboard";
  const registered = searchParams.registered === "1";

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f4ef] px-4 py-10">
      <section className="panel-enter w-full max-w-md rounded-2xl border border-[#ded5c5] bg-[#fffaf1] p-6 shadow-[0_24px_100px_rgba(39,36,31,0.12)] sm:p-8">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" weight="duotone" aria-hidden="true" />
            Back
          </Link>
        </Button>
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#1d4f43] text-[#fffaf1]">
          <ShieldCheckered className="h-6 w-6" weight="duotone" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#27241f]">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-[#655c50]">Access request tracking, officer queues, and administrator tools.</p>
        <div className="mt-6">
          <LoginForm callbackUrl={callbackUrl} registered={registered} />
        </div>
        <p className="mt-6 text-sm text-[#655c50]">
          New student or staff member?{" "}
          <Link href="/register" className="font-semibold text-[#1d4f43] hover:text-[#163f36]">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
