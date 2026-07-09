import type { Metadata } from "next";
import { LoginForm } from "@/components/layout/login-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to CUSP and start playing word games with real stakes.",
  robots: { index: true, follow: true },
};

export default async function LoginPage(props: { searchParams?: Promise<{ error?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const searchParams = await props.searchParams;

  if (user) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 sm:px-6 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">CUSP</h1>
        <p className="mt-2 text-sm text-ink-secondary">
          On the edge of a win
        </p>
      </div>
      <div className="mt-10 w-full">
        <LoginForm error={searchParams?.error} />
      </div>
    </main>
  );
}
