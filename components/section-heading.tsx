import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        {eyebrow && (
          <p className="text-[11px] tracking-[0.18em] text-muted-foreground mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-medium tracking-tight">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
