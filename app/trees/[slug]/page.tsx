import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lightbulb, NotebookPen, ArrowRight } from "lucide-react";
import { getTreeData } from "@/lib/tasks";
import { getObservations, mergeJournal, relativeDaysHe } from "@/lib/garden";
import { TaskCard } from "@/components/task-card";
import { CarePlanTimeline } from "@/components/care-plan-timeline";
import { JournalFeed } from "@/components/journal-feed";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";

export default async function TreePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getTreeData(slug);
  if (!data) notFound();

  const { tree, plan, logs, pending } = data;
  const obs = await getObservations(tree.id);
  const journal = mergeJournal(logs, obs);
  const lastCaredAt = logs[0]?.doneAt ?? null;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const doneIds = new Set(
    logs
      .filter((l) => l.carePlanId && l.doneAt >= yearStart)
      .map((l) => l.carePlanId as string)
  );

  const actionable = pending.filter(
    (t) => t.status === "overdue" || t.status === "current"
  );

  return (
    <div className="md:px-8 md:pt-6 max-w-6xl mx-auto">
      <div className="md:grid md:grid-cols-[440px_1fr] md:gap-12 md:items-start">
        {/* Photo — sticky on desktop */}
        <section className="relative h-[48vh] min-h-[360px] md:h-auto md:aspect-[4/5] md:sticky md:top-22 overflow-hidden rounded-b-3xl md:rounded-2xl shadow-card">
          <div className="absolute inset-0 hero-zoom">
            {tree.photoUrl && (
              <Image
                src={tree.photoUrl}
                alt={tree.name}
                fill
                preload
                sizes="(max-width: 768px) 100vw, 440px"
                className="object-cover"
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10" />
          <Link
            href="/trees"
            className="absolute top-5 start-4 z-10 flex items-center justify-center size-10 rounded-full glass !bg-black/20 text-white transition-transform active:scale-90"
            aria-label="חזרה לעצים"
          >
            <ArrowRight className="size-5" strokeWidth={1.75} />
          </Link>
          <div className="absolute bottom-0 inset-x-0 p-6">
            {tree.species && (
              <p
                className="reveal text-white/60 text-[10px] tracking-[0.24em] uppercase mb-1.5"
                style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
              >
                {tree.species}
              </p>
            )}
            <h1
              className="reveal font-display text-5xl font-medium text-white tracking-tight"
              style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
            >
              {tree.name}
            </h1>
            {lastCaredAt && (
              <p
                className="reveal text-white/70 text-xs mt-2.5"
                style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
              >
                טיפול אחרון: {relativeDaysHe(lastCaredAt)}
              </p>
            )}
          </div>
        </section>

        {/* Content column */}
        <div className="px-4 md:px-0 pt-7 md:pt-2 space-y-10">
          {tree.notes && (
            <div
              className="reveal flex gap-3 border-s-2 border-harvest ps-4 py-1"
              style={{ "--reveal-delay": "300ms" } as React.CSSProperties}
            >
              <p className="text-sm leading-relaxed text-foreground/85">
                <Lightbulb className="size-4 text-harvest inline-block ms-0 me-1.5 -mt-0.5" />
                {tree.notes}
              </p>
            </div>
          )}

          {actionable.length > 0 && (
            <section
              className="reveal"
              style={{ "--reveal-delay": "380ms" } as React.CSSProperties}
            >
              <SectionHeading
                eyebrow={`${actionable.length} משימות`}
                title="לטיפול עכשיו"
              />
              <div className="space-y-3">
                {actionable.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={{
                      id: task.id,
                      treeId: task.treeId,
                      treeName: tree.name,
                      treeSlug: tree.slug,
                      treePhoto: tree.photoUrl,
                      action: task.action,
                      description: task.description,
                      month: task.month!,
                      status: task.status as "overdue" | "current",
                    }}
                    showTree={false}
                  />
                ))}
              </div>
            </section>
          )}

          <section
            className="reveal"
            style={{ "--reveal-delay": "460ms" } as React.CSSProperties}
          >
            <SectionHeading eyebrow="תכנית שנתית" title="מחזור הטיפול" />
            <CarePlanTimeline
              plan={plan}
              doneIds={doneIds}
              currentMonth={currentMonth}
            />
          </section>

          <section
            className="reveal"
            style={{ "--reveal-delay": "540ms" } as React.CSSProperties}
          >
            <SectionHeading
              eyebrow="היסטוריה ותצפיות"
              title="יומן העץ"
              action={
                <Link
                  href={`/trees/${slug}/observe`}
                  className="inline-flex items-center gap-1.5 text-sm border border-foreground/70 rounded-full px-4 py-1.5 transition-colors duration-200 hover:bg-foreground hover:text-background"
                >
                  <NotebookPen className="size-3.5" strokeWidth={1.75} />
                  תצפית חדשה
                </Link>
              }
            />
            <JournalFeed entries={journal} />
          </section>
        </div>
      </div>
    </div>
  );
}
