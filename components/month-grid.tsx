import Link from "next/link";
import { Check } from "lucide-react";
import type { MonthSummary } from "@/lib/garden";
import { HEBREW_MONTHS } from "@/lib/tasks";

export function MonthGrid({
  summaries,
  selected,
  current,
}: {
  summaries: MonthSummary[];
  selected: number;
  current: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {summaries.map(({ month, total, done }) => {
        const isSelected = month === selected;
        const isCurrent = month === current;
        const allDone = total > 0 && done >= total;

        let cls =
          "bg-card border border-border text-foreground hover:border-primary/40";
        if (isSelected) {
          cls = "bg-primary text-primary-foreground shadow-soft border border-primary";
        } else if (isCurrent) {
          cls = "bg-secondary border border-primary/30 ring-2 ring-primary/20";
        } else if (total === 0) {
          cls = "bg-muted/50 border border-transparent text-muted-foreground/60";
        }

        return (
          <Link
            key={month}
            href={`/calendar?month=${month}`}
            className={`flex flex-col items-center rounded-2xl py-2.5 transition-colors ${cls}`}
          >
            <span className="text-sm font-medium">
              {HEBREW_MONTHS[month - 1]}
            </span>
            <span
              className={`text-[11px] flex items-center gap-0.5 ${
                isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}
            >
              {total === 0 ? (
                "—"
              ) : allDone ? (
                <>
                  <Check className="size-3 text-leaf" strokeWidth={3} />
                  הושלם
                </>
              ) : (
                `${done}/${total}`
              )}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
