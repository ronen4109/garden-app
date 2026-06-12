"use client";

import { useFormStatus } from "react-dom";
import { Check, Loader2 } from "lucide-react";

export function DoneButton({ label = "סיימתי" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-1.5 bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-medium shadow-soft transition-all active:scale-[0.98] disabled:opacity-70"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Check className="size-4" strokeWidth={2.5} />
      )}
      {label}
    </button>
  );
}
