import type { ReactNode } from "react";

export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      {action}
    </div>
  );
}
