import { NotebookPen } from "lucide-react";
import type { JournalEntry } from "@/lib/garden";
import { relativeDaysHe } from "@/lib/garden";
import { ActionIcon } from "./action-icon";

export function JournalFeed({ entries }: { entries: JournalEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        אין רישומים עדיין — הפעולה הראשונה שתתעדו תופיע כאן.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border/70 border-y border-border/70">
      {entries.map((entry) => (
        <div key={`${entry.kind}-${entry.id}`} className="flex gap-3.5 py-4">
          <span className="mt-0.5 shrink-0 text-muted-foreground">
            {entry.kind === "log" ? (
              <ActionIcon
                action={entry.action}
                className="size-[18px]"
                strokeWidth={1.6}
              />
            ) : (
              <NotebookPen className="size-[18px]" strokeWidth={1.6} />
            )}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-medium text-sm">
                {entry.kind === "log" ? entry.action : "תצפית"}
              </p>
              <time
                className="text-[11px] text-muted-foreground whitespace-nowrap"
                title={entry.date.toLocaleDateString("he-IL")}
              >
                {relativeDaysHe(entry.date)}
              </time>
            </div>
            {entry.kind === "log" && entry.note && (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {entry.note}
              </p>
            )}
            {entry.kind === "observation" && (
              <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
                {entry.text}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
