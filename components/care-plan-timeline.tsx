import { Check } from "lucide-react";
import type { CarePlanItem } from "@/db/schema";
import { HEBREW_MONTHS } from "@/lib/tasks";
import { ActionIcon } from "./action-icon";

export function CarePlanTimeline({
  plan,
  doneIds,
  currentMonth,
}: {
  plan: CarePlanItem[];
  doneIds: Set<string>;
  currentMonth: number;
}) {
  const byMonth = new Map<number, CarePlanItem[]>();
  for (const item of plan) {
    if (!item.month) continue;
    const list = byMonth.get(item.month) ?? [];
    list.push(item);
    byMonth.set(item.month, list);
  }

  // Order months starting from the current one, so "now" is at the top.
  const months = Array.from({ length: 12 }, (_, i) => ((currentMonth - 1 + i) % 12) + 1).filter(
    (m) => byMonth.has(m)
  );

  return (
    <div className="relative border-s-2 border-border ms-3 space-y-5">
      {months.map((month) => {
        const items = byMonth.get(month)!;
        const isCurrent = month === currentMonth;
        return (
          <div key={month} className="relative ps-6">
            <span
              className={`absolute -start-[9px] top-1 size-4 rounded-full border-2 ${
                isCurrent
                  ? "bg-primary border-primary ring-4 ring-primary/15"
                  : "bg-card border-border"
              }`}
            />
            <div
              className={
                isCurrent ? "bg-secondary/60 rounded-2xl p-3 -ms-1" : ""
              }
            >
              <p
                className={`text-sm font-bold mb-2 ${
                  isCurrent ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {HEBREW_MONTHS[month - 1]}
                {isCurrent && " · החודש"}
              </p>
              <div className="space-y-2.5">
                {items.map((item) => {
                  const done = doneIds.has(item.id);
                  return (
                    <div key={item.id} className="flex gap-2.5">
                      <span
                        className={`flex items-center justify-center size-7 rounded-lg shrink-0 ${
                          done
                            ? "bg-leaf-soft text-leaf"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {done ? (
                          <Check className="size-3.5" strokeWidth={3} />
                        ) : (
                          <ActionIcon action={item.action} className="size-3.5" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            done ? "text-muted-foreground line-through" : ""
                          }`}
                        >
                          {item.action}
                        </p>
                        {item.description && !done && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
