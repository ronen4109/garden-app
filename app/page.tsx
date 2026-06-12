import Link from "next/link";
import Image from "next/image";
import { Plus, Sun, Leaf, Flower2, CloudRain, Sprout } from "lucide-react";
import { getPendingTasks, HEBREW_MONTHS } from "@/lib/tasks";
import { getTreesWithStatus, getSeasonContext } from "@/lib/garden";
import { TaskCard } from "@/components/task-card";
import { TreeStatusChip } from "@/components/tree-status-chip";
import { SectionHeading } from "@/components/section-heading";
import { ActionIcon } from "@/components/action-icon";

export const dynamic = "force-dynamic";

const SEASON_ICONS = {
  sun: Sun,
  leaf: Leaf,
  flower: Flower2,
  rain: CloudRain,
} as const;

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
  const SeasonIcon = SEASON_ICONS[season.icon];
  const heroPhoto = SEASON_HERO[season.label] ?? "/trees/pomegranate.jpeg";

  const current = tasks.filter((t) => t.status === "current");
  const overdue = tasks.filter((t) => t.status === "overdue");
  const urgent = [...current, ...overdue.slice(0, 3)];
  const hiddenOverdue = overdue.length - Math.min(overdue.length, 3);
  const upcoming = tasks.filter((t) => t.status === "upcoming").slice(0, 3);

  return (
    <div>
      {/* Cinematic seasonal hero */}
      <section className="relative h-[48vh] min-h-[370px] overflow-hidden rounded-b-[2.5rem] shadow-card">
        <div className="absolute inset-0 hero-zoom">
          <Image
            src={heroPhoto}
            alt=""
            fill
            preload
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
        <div className="absolute bottom-0 inset-x-0 p-6 pb-16">
          <p className="reveal text-white/80 text-sm font-medium flex items-center gap-1.5 mb-1">
            <SeasonIcon className="size-4" />
            {HEBREW_MONTHS[month - 1]} · {season.label}
          </p>
          <h1
            className="reveal font-display text-5xl font-black text-white leading-tight"
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
          >
            {greeting()}
          </h1>
          <p
            className="reveal text-white/85 mt-2 text-[15px] leading-relaxed"
            style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
          >
            {season.line}
          </p>
        </div>
      </section>

      <div className="px-4 space-y-9">
        {/* Tree status strip — floats up over the hero edge */}
        <section
          className="reveal -mt-9 relative z-10"
          style={{ "--reveal-delay": "350ms" } as React.CSSProperties}
        >
          <div className="glass rounded-3xl shadow-card border border-white/50 px-3 py-4">
            <div className="flex gap-3 overflow-x-auto snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {treesWithStatus.map((tree, i) => (
                <div
                  key={tree.id}
                  className="reveal"
                  style={
                    {
                      "--reveal-delay": `${420 + i * 70}ms`,
                    } as React.CSSProperties
                  }
                >
                  <TreeStatusChip tree={tree} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {urgent.length === 0 ? (
          <section
            className="reveal bg-leaf-soft rounded-3xl p-8 text-center"
            style={{ "--reveal-delay": "500ms" } as React.CSSProperties}
          >
            <span className="float-slow inline-flex items-center justify-center size-14 rounded-full bg-card shadow-soft mb-3">
              <Sprout className="size-7 text-leaf" />
            </span>
            <p className="font-display text-lg font-bold text-secondary-foreground">
              אין משימות דחופות החודש
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              הגינה מסודרת — אפשר פשוט ליהנות ממנה.
            </p>
          </section>
        ) : (
          <section>
            <div
              className="reveal"
              style={{ "--reveal-delay": "500ms" } as React.CSSProperties}
            >
              <SectionHeading title={`לטיפול עכשיו (${urgent.length})`} />
            </div>
            <div className="space-y-3">
              {urgent.map((task, i) => (
                <div
                  key={task.id}
                  className="reveal"
                  style={
                    {
                      "--reveal-delay": `${560 + i * 90}ms`,
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
                className="block text-center text-sm text-muted-foreground mt-3 transition-colors hover:text-primary"
              >
                + עוד {hiddenOverdue} משימות מחודשים קודמים בלוח השנה
              </Link>
            )}
          </section>
        )}

        {upcoming.length > 0 && (
          <section
            className="reveal"
            style={{ "--reveal-delay": "700ms" } as React.CSSProperties}
          >
            <SectionHeading title="בהמשך השנה" />
            <div className="bg-card rounded-3xl shadow-soft divide-y divide-border/60 overflow-hidden">
              {upcoming.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3.5 transition-colors hover:bg-muted/40"
                >
                  <span className="flex items-center justify-center size-9 rounded-xl bg-muted text-muted-foreground shrink-0">
                    <ActionIcon action={task.action} className="size-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{task.action}</p>
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
            className="group flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-3xl py-4 text-lg font-medium shadow-card transition-all duration-300 hover:shadow-lg hover:brightness-110 active:scale-[0.98]"
          >
            <Plus
              className="size-5 transition-transform duration-300 group-hover:rotate-90"
              strokeWidth={2.5}
            />
            תיעוד פעולה
          </Link>
        </section>
      </div>
    </div>
  );
}
