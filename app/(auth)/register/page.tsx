import Link from "next/link";
import { ArrowLeft, UserCirclePlus } from "@phosphor-icons/react/dist/ssr";
import { RegisterForm } from "@/app/(auth)/register/register-form";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f4ef] px-4 py-10">
      <section className="panel-enter w-full max-w-2xl rounded-2xl border border-[#ded5c5] bg-[#fffaf1] p-6 shadow-[0_24px_100px_rgba(39,36,31,0.12)] sm:p-8">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" weight="duotone" aria-hidden="true" />
            Back
          </Link>
        </Button>
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#1d4f43] text-[#fffaf1]">
          <UserCirclePlus className="h-6 w-6" weight="duotone" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#27241f]">Create account</h1>
        <p className="mt-2 text-sm leading-6 text-[#655c50]">Student and staff accounts can submit and track campus maintenance requests.</p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-6 text-sm text-[#655c50]">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-[#1d4f43] hover:text-[#163f36]">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
