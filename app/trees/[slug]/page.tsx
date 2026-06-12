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
    <div>
      {/* Full-bleed cinematic hero */}
      <section className="relative h-[52vh] min-h-[380px] overflow-hidden rounded-b-[2.5rem] shadow-card">
        <div className="absolute inset-0 hero-zoom">
          {tree.photoUrl && (
            <Image
              src={tree.photoUrl}
              alt={tree.name}
              fill
              preload
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/15" />
        <Link
          href="/trees"
          className="absolute top-5 start-4 z-10 flex items-center justify-center size-10 rounded-full glass !bg-black/25 text-white transition-transform active:scale-90"
          aria-label="חזרה לעצים"
        >
          <ArrowRight className="size-5" />
        </Link>
        <div className="absolute bottom-0 inset-x-0 p-6 pb-7">
          <h1
            className="reveal font-display text-5xl font-black text-white"
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            {tree.name}
          </h1>
          {tree.species && (
            <p
              className="reveal text-white/70 text-sm italic mt-1"
              style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
            >
              {tree.species}
            </p>
          )}
          {lastCaredAt && (
            <span
              className="reveal inline-block mt-3 glass !bg-white/20 text-white rounded-full px-3 py-1 text-xs"
              style={{ "--reveal-delay": "280ms" } as React.CSSProperties}
            >
              טיפול אחרון: {relativeDaysHe(lastCaredAt)}
            </span>
          )}
        </div>
      </section>

      <div className="px-4 pt-7 space-y-9">
        {tree.notes && (
          <div
            className="reveal flex gap-3 bg-harvest-soft rounded-3xl p-4"
            style={{ "--reveal-delay": "300ms" } as React.CSSProperties}
          >
            <Lightbulb className="size-5 text-harvest shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">{tree.notes}</p>
          </div>
        )}

        {actionable.length > 0 && (
          <section
            className="reveal"
            style={{ "--reveal-delay": "380ms" } as React.CSSProperties}
          >
            <SectionHeading title="לטיפול עכשיו" />
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
          <SectionHeading title="מחזור הטיפול השנתי" />
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
            title="יומן העץ"
            action={
              <Link
                href={`/trees/${slug}/observe`}
                className="inline-flex items-center gap-1.5 text-sm font-medium bg-secondary text-secondary-foreground rounded-full px-3.5 py-1.5 transition-all hover:bg-secondary/70 active:scale-95"
              >
                <NotebookPen className="size-3.5" />
                תצפית חדשה
              </Link>
            }
          />
          <div className="bg-card rounded-3xl shadow-soft px-4 py-2">
            <JournalFeed entries={journal} />
          </div>
        </section>
      </div>
    </div>
  );
}
