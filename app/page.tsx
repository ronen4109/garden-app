import Link from "next/link";
import Image from "next/image";
import { Plus, Sprout } from "lucide-react";
import { getPendingTasks, HEBREW_MONTHS } from "@/lib/tasks";
import { getTreesWithStatus, getSeasonContext } from "@/lib/garden";
import { TaskCard } from "@/components/task-card";
import { TreeStatusChip } from "@/components/tree-status-chip";
import { SectionHeading } from "@/components/section-heading";
import { ActionIcon } from "@/components/action-icon";

export const dynamic = "force-dynamic";

// A different hero photo per season keeps the home page alive year-round.
const SEASON_HERO: Record<string, string> = {
  אביב: "/trees/pomegranate.jpeg",
  קיץ: "/trees/mango.jpeg",
  סתיו: "/trees/orange.jpeg",
  חורף: "/trees/lemon.jpeg",
};

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "לילה טוב";
  if (hour < 12) return "בוקר טוב";
  if (hour < 18) return "צהריים טובים";
  return "ערב טוב";
}

export default async function HomePage() {
  const [tasks, treesWithStatus] = await Promise.all([
    getPendingTasks(),
    getTreesWithStatus(),
  ]);

  const now = new Date();
  const month = now.getMonth() + 1;
  const season = getSeasonContext(month);
  const heroPhoto = SEASON_HERO[season.label] ?? "/trees/pomegranate.jpeg";

  const current = tasks.filter((t) => t.status === "current");
  const overdue = tasks.filter((t) => t.status === "overdue");
  const urgent = [...current, ...overdue.slice(0, 3)];
  const hiddenOverdue = overdue.length - Math.min(overdue.length, 3);
  const upcoming = tasks.filter((t) => t.status === "upcoming").slice(0, 3);

  return (
    <div>
      {/* Editorial hero */}
      <section className="relative h-[46vh] min-h-[360px] md:h-[54vh] overflow-hidden md:mx-8 md:mt-6 md:rounded-2xl rounded-b-3xl shadow-card">
        <div className="absolute inset-0 hero-zoom">
          <Image
            src={heroPhoto}
            alt=""
            fill
            preload
            sizes="(max-width: 768px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />
        <div className="absolute bottom-0 inset-x-0 p-6 pb-16 md:p-12 md:pb-12 max-w-2xl">
          <p
            className="reveal text-white/70 text-[11px] tracking-[0.28em] mb-3"
            style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
          >
            {HEBREW_MONTHS[month - 1]} · {season.label}
          </p>
          <h1
            className="reveal font-display text-5xl md:text-6xl font-medium text-white tracking-tight leading-none"
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
          >
            {greeting()}
          </h1>
          <p
            className="reveal text-white/80 mt-3.5 text-[15px] md:text-base leading-relaxed"
            style={{ "--reveal-delay": "280ms" } as React.CSSProperties}
          >
            {season.line}
          </p>
        </div>
      </section>

      <div className="px-4 md:px-8">
        {/* Tree status strip */}
        <section
          className="reveal -mt-9 md:-mt-10 relative z-10 max-w-3xl mx-auto"
          style={{ "--reveal-delay": "380ms" } as React.CSSProperties}
        >
          <div className="glass rounded-2xl border border-border/60 shadow-soft px-4 py-4">
            <div className="flex gap-3 md:gap-6 md:justify-center overflow-x-auto snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {treesWithStatus.map((tree, i) => (
                <div
                  key={tree.id}
                  className="reveal"
                  style={
                    {
                      "--reveal-delay": `${440 + i * 60}ms`,
                    } as React.CSSProperties
                  }
                >
                  <TreeStatusChip tree={tree} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Body — two columns on desktop */}
        <div className="mt-12 md:grid md:grid-cols-[1fr_320px] md:gap-12 max-w-5xl mx-auto space-y-12 md:space-y-0">
          <div>
            {urgent.length === 0 ? (
              <section
                className="reveal border border-border/80 bg-card rounded-2xl p-10 text-center"
                style={{ "--reveal-delay": "520ms" } as React.CSSProperties}
              >
                <Sprout className="size-7 text-leaf mx-auto mb-3" strokeWidth={1.5} />
                <p className="font-display text-xl font-medium">
                  אין משימות דחופות החודש
                </p>
                <p className="text-sm text-muted-foreground mt-1.5">
                  הגינה מסודרת — אפשר פשוט ליהנות ממנה.
                </p>
              </section>
            ) : (
              <section>
                <div
                  className="reveal"
                  style={{ "--reveal-delay": "520ms" } as React.CSSProperties}
                >
                  <SectionHeading
                    eyebrow={`${urgent.length} משימות`}
                    title="לטיפול עכשיו"
                  />
                </div>
                <div className="space-y-3">
                  {urgent.map((task, i) => (
                    <div
                      key={task.id}
                      className="reveal"
                      style={
                        {
                          "--reveal-delay": `${580 + i * 80}ms`,
                        } as React.CSSProperties
                      }
                    >
                      <TaskCard task={task} />
                    </div>
                  ))}
                </div>
                {hiddenOverdue > 0 && (
                  <Link
                    href="/calendar"
                    className="block text-center text-sm text-muted-foreground mt-4 transition-colors hover:text-foreground"
                  >
                    + עוד {hiddenOverdue} משימות מחודשים קודמים בלוח השנה
                  </Link>
                )}
              </section>
            )}
          </div>

          <aside className="space-y-10">
            {upcoming.length > 0 && (
              <section
                className="reveal"
                style={{ "--reveal-delay": "700ms" } as React.CSSProperties}
              >
                <SectionHeading title="בהמשך השנה" />
                <div className="divide-y divide-border/70 border-y border-border/70">
                  {upcoming.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 py-3.5">
                      <ActionIcon
                        action={task.action}
                        className="size-4 text-muted-foreground shrink-0"
                        strokeWidth={1.75}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{task.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.treeName}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {HEBREW_MONTHS[task.month - 1]}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section
              className="reveal"
              style={{ "--reveal-delay": "800ms" } as React.CSSProperties}
            >
              <Link
                href="/log"
                className="group flex items-center justify-center gap-2 border border-foreground/80 text-foreground rounded-full py-3.5 text-base transition-colors duration-300 hover:bg-foreground hover:text-background"
              >
                <Plus
                  className="size-4 transition-transform duration-300 group-hover:rotate-90"
                  strokeWidth={2}
                />
                תיעוד פעולה
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
