"use client";

import { useState, useRef, useEffect } from "react";
import { updateUsername } from "@/actions/profile";

interface UsernameEditorProps {
  initial: string;
}

export function UsernameEditor({ initial }: UsernameEditorProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  async function handleSave() {
    const trimmed = value.trim();
    if (!trimmed || trimmed === initial) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateUsername(trimmed);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
      setSaving(false);
    }
  }

  function handleCancel() {
    setValue(initial);
    setError(null);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="group flex items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-semibold text-ink">
          {value}
        </h1>
        <button
          onClick={() => setEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 text-ink-muted hover:text-ink hover:bg-border"
          aria-label="Edit username"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M10.5 1.5L12.5 3.5L4.5 11.5L1.5 12.5L2.5 9.5L10.5 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") handleCancel();
          }}
          maxLength={20}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-lg sm:text-xl font-semibold text-ink outline-none focus:border-accent transition-colors"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-accent px-3 py-1.5 font-label text-xs text-white transition-all hover:opacity-90 disabled:opacity-40 active:scale-[0.97]"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={handleCancel}
          disabled={saving}
          className="rounded-lg border border-border px-3 py-1.5 font-label text-xs text-ink-secondary transition-all hover:bg-border active:scale-[0.97]"
        >
          Cancel
        </button>
      </div>
      {error && (
        <span className="font-label text-[11px] text-rose">{error}</span>
      )}
    </div>
  );
}
