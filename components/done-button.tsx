"use client";

import { useFormStatus } from "react-dom";
import { Check, Loader2 } from "lucide-react";

export function DoneButton({ label = "סיימתי" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-1.5 border border-foreground/75 text-foreground rounded-full px-5 py-1.5 text-sm transition-all duration-200 hover:bg-foreground hover:text-background active:scale-[0.97] disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Check className="size-3.5" strokeWidth={2.5} />
      )}
      {label}
    </button>
  );
}
