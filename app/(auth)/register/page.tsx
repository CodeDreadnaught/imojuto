import Link from "next/link";
import { RegisterForm } from "@/app/(auth)/register/register-form";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-4 py-10">
      <section className="w-full max-w-2xl rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="font-serif text-3xl font-semibold text-stone-950">Create account</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">Student and staff accounts can submit and track campus maintenance requests.</p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-6 text-sm text-stone-600">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-emerald-800 hover:text-emerald-900">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
