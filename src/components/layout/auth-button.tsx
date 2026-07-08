"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function AuthButton({ email }: { email?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (!email) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs text-ink-muted sm:block">{email}</span>
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="rounded-md border border-border px-3 py-2 sm:py-1.5 font-label text-xs text-ink-muted transition-colors hover:border-rose hover:text-rose active:text-rose active:border-rose disabled:opacity-50 touch-manipulation"
      >
        {loading ? "..." : "Sign Out"}
      </button>
    </div>
  );
}
