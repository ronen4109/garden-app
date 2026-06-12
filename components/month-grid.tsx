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
    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
      {summaries.map(({ month, total, done }) => {
        const isSelected = month === selected;
        const isCurrent = month === current;
        const allDone = total > 0 && done >= total;

        let cls =
          "bg-card border-border/80 hover:border-foreground/40";
        if (isSelected) {
          cls = "bg-foreground text-background border-foreground";
        } else if (isCurrent) {
          cls = "bg-card border-foreground/60";
        } else if (total === 0) {
          cls = "border-transparent text-muted-foreground/50";
        }

        return (
          <Link
            key={month}
            href={`/calendar?month=${month}`}
            className={`flex flex-col items-center border rounded-xl py-3 transition-colors duration-200 ${cls}`}
          >
            <span className="font-display text-[15px] font-medium">
              {HEBREW_MONTHS[month - 1]}
            </span>
            <span
              className={`text-[11px] mt-0.5 flex items-center gap-1 ${
                isSelected ? "text-background/70" : "text-muted-foreground"
              }`}
            >
              {total === 0 ? (
                "—"
              ) : allDone ? (
                <>
                  <Check className="size-3" strokeWidth={2.5} />
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
