import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { getTasksForMonth, HEBREW_MONTHS } from "@/lib/tasks";
import { getMonthSummaries } from "@/lib/garden";
import { MonthGrid } from "@/components/month-grid";
import { SectionHeading } from "@/components/section-heading";
import { ActionIcon } from "@/components/action-icon";

export const dynamic = "force-dynamic";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const selectedMonth = monthParam
    ? Math.min(12, Math.max(1, parseInt(monthParam, 10) || currentMonth))
    : currentMonth;

  const [tasks, summaries] = await Promise.all([
    getTasksForMonth(selectedMonth),
    getMonthSummaries(),
  ]);

  return (
    <div className="px-4 md:px-8 pt-8 md:pt-14 max-w-3xl mx-auto space-y-8">
      <div className="reveal">
        <p className="text-[11px] tracking-[0.22em] text-muted-foreground mb-1.5">
          {new Date().getFullYear()}
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
          לוח השנה של הגינה
        </h1>
      </div>

      <div
        className="reveal"
        style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
      >
        <MonthGrid
          summaries={summaries}
          selected={selectedMonth}
          current={currentMonth}
        />
      </div>

      <section
        className="reveal"
        style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
      >
        <SectionHeading
          title={`${HEBREW_MONTHS[selectedMonth - 1]}${
            selectedMonth === currentMonth ? " · החודש" : ""
          }`}
        />
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            אין משימות מתוכננות בחודש הזה.
          </p>
        ) : (
          <div className="bg-card rounded-2xl shadow-soft divide-y divide-border/60">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3.5 ${
                  task.doneAt ? "opacity-55" : ""
                }`}
              >
                {task.treePhoto && (
                  <Image
                    src={task.treePhoto}
                    alt={task.treeName}
                    width={40}
                    height={40}
                    className="size-10 rounded-xl object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm flex items-center gap-1.5">
                    {task.doneAt && (
                      <Check
                        className="size-3.5 text-leaf shrink-0"
                        strokeWidth={3}
                      />
                    )}
                    {task.action}
                  </p>
                  <Link
                    href={`/trees/${task.treeSlug}`}
                    className="text-xs text-primary hover:underline"
                  >
                    {task.treeName}
                  </Link>
                </div>
                {task.doneAt ? (
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {new Date(task.doneAt).toLocaleDateString("he-IL")}
                  </span>
                ) : (
                  <span className="flex items-center justify-center size-8 rounded-lg bg-muted text-muted-foreground shrink-0">
                    <ActionIcon action={task.action} className="size-4" />
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
