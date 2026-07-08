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
    <div className="flex items-center gap-3">
      <span className="hidden text-xs text-text-muted sm:block">{email}</span>
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="rounded-lg border border-tile-border/30 px-3 py-1.5 text-xs font-medium text-text-secondary transition-all hover:border-neon-red/50 hover:text-neon-red disabled:opacity-50"
      >
        {loading ? "..." : "Sign Out"}
      </button>
    </div>
  );
}
