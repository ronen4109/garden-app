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
    <div className="space-y-1">
      {entries.map((entry) => (
        <div key={`${entry.kind}-${entry.id}`} className="flex gap-3 py-2.5">
          <span
            className={`flex items-center justify-center size-9 rounded-full shrink-0 mt-0.5 ${
              entry.kind === "log"
                ? "bg-leaf-soft text-leaf"
                : "bg-harvest-soft text-harvest"
            }`}
          >
            {entry.kind === "log" ? (
              <ActionIcon action={entry.action} className="size-4" />
            ) : (
              <NotebookPen className="size-4" />
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
              <p className="text-sm text-muted-foreground mt-0.5">
                {entry.note}
              </p>
            )}
            {entry.kind === "observation" && (
              <p className="text-sm text-foreground/85 mt-0.5 leading-relaxed">
                {entry.text}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
