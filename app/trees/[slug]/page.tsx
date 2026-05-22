import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTreeData, HEBREW_MONTHS } from "@/lib/tasks";
import { db } from "@/db";
import { observations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { markTaskDone, addObservation } from "@/app/actions";

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

  const obs = await db
    .select()
    .from(observations)
    .where(eq(observations.treeId, tree.id))
    .orderBy(desc(observations.createdAt))
    .limit(20);

  return (
    <div className="space-y-6">
      <div className="relative aspect-[4/3] bg-stone-100 rounded-lg overflow-hidden">
        {tree.photoUrl && (
          <Image
            src={tree.photoUrl}
            alt={tree.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
            priority
          />
        )}
      </div>

      <div>
        <h1 className="text-3xl font-bold">{tree.name}</h1>
        {tree.species && (
          <p className="text-sm text-stone-500 italic">{tree.species}</p>
        )}
        {tree.notes && (
          <p className="mt-2 text-stone-700 text-sm bg-amber-50 border border-amber-200 rounded p-2">
            💡 {tree.notes}
          </p>
        )}
      </div>

      {pending.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">משימות פתוחות</h2>
          {pending.map((task) => (
            <div
              key={task.id}
              className={`border-2 rounded-lg p-4 ${
                task.status === "overdue"
                  ? "border-amber-300 bg-amber-50"
                  : task.status === "current"
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">{task.action}</p>
                <span className="text-xs text-stone-500">
                  {HEBREW_MONTHS[task.month! - 1]}
                </span>
              </div>
              {task.description && (
                <p className="text-sm text-stone-600 mb-2">{task.description}</p>
              )}
              {(task.status === "overdue" || task.status === "current") && (
                <form action={markTaskDone}>
                  <input type="hidden" name="carePlanId" value={task.id} />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md px-4 py-1.5 text-sm font-medium"
                  >
                    ✓ סיימתי
                  </button>
                </form>
              )}
            </div>
          ))}
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-3">תכנית הטיפול השנתית</h2>
        <div className="bg-white border border-stone-200 rounded-lg divide-y divide-stone-100">
          {plan.map((p) => (
            <div key={p.id} className="p-3 text-sm">
              <div className="flex justify-between items-start gap-2">
                <span className="font-medium">{p.action}</span>
                <span className="text-xs text-stone-500 whitespace-nowrap">
                  {p.month ? HEBREW_MONTHS[p.month - 1] : ""}
                </span>
              </div>
              {p.description && (
                <p className="text-stone-600 mt-1">{p.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">תצפיות</h2>
          <Link
            href={`/trees/${slug}/observe`}
            className="text-sm bg-stone-800 hover:bg-stone-900 text-white rounded-md px-3 py-1.5"
          >
            + הוסף תצפית
          </Link>
        </div>
        {obs.length === 0 ? (
          <p className="text-sm text-stone-500">אין תצפיות עדיין.</p>
        ) : (
          <div className="space-y-2">
            {obs.map((o) => (
              <div key={o.id} className="bg-white border border-stone-200 rounded-lg p-3 text-sm">
                <p className="text-xs text-stone-500 mb-1">
                  {new Date(o.createdAt).toLocaleDateString("he-IL")}
                </p>
                <p>{o.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {logs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">היסטוריית טיפולים</h2>
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="bg-white border border-stone-200 rounded-lg p-3 text-sm flex justify-between gap-3">
                <div>
                  <p className="font-medium">{log.action}</p>
                  {log.note && <p className="text-stone-600 text-xs mt-1">{log.note}</p>}
                </div>
                <p className="text-xs text-stone-500 whitespace-nowrap">
                  {new Date(log.doneAt).toLocaleDateString("he-IL")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
