import { LoginForm } from "@/components/layout/login-form";
import { Nav } from "@/components/layout/nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage(props: { searchParams?: Promise<{ error?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  const searchParams = await props.searchParams;

  return (
    <>
      <Nav />
      <main className="mx-auto flex max-w-md flex-col items-center px-6 py-24">
        <h1 className="font-heading text-4xl font-extrabold text-neon-green text-center">
          CUSP
        </h1>
        <p className="mt-2 text-text-secondary text-center">
          On the edge of a win
        </p>
        <div className="mt-10 w-full">
          <LoginForm error={searchParams?.error} />
        </div>
      </main>
    </>
  );
}
