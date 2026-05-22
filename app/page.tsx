import Link from "next/link";
import Image from "next/image";
import { getPendingTasks, HEBREW_MONTHS } from "@/lib/tasks";
import { markTaskDone } from "./actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tasks = await getPendingTasks();
  const now = new Date();
  const currentMonth = HEBREW_MONTHS[now.getMonth()];

  const urgent = tasks.filter((t) => t.status === "overdue" || t.status === "current");
  const upcoming = tasks.filter((t) => t.status === "upcoming").slice(0, 3);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold mb-1">שלום! 👋</h1>
        <p className="text-stone-600">חודש {currentMonth} — הנה מה שצריך לעשות בגינה.</p>
      </section>

      {urgent.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
          <p className="text-3xl mb-2">🌿</p>
          <p className="text-emerald-900 font-medium">אין משימות דחופות החודש</p>
          <p className="text-sm text-emerald-700 mt-1">אפשר ליהנות מהגינה.</p>
        </div>
      ) : (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">משימות פתוחות ({urgent.length})</h2>
          {urgent.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-600">בקרוב</h2>
          {upcoming.map((task) => (
            <div
              key={task.id}
              className="bg-white border border-stone-200 rounded-lg p-3 flex items-center gap-3"
            >
              {task.treePhoto && (
                <Image
                  src={task.treePhoto}
                  alt={task.treeName}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-md object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium">{task.action}</p>
                <p className="text-sm text-stone-600">
                  {task.treeName} · {HEBREW_MONTHS[task.month - 1]}
                </p>
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="pt-4">
        <Link
          href="/trees"
          className="block bg-emerald-600 hover:bg-emerald-700 text-white text-center rounded-lg py-3 font-medium"
        >
          כל העצים שלי 🌳
        </Link>
      </section>
    </div>
  );
}

function TaskCard({ task }: { task: Awaited<ReturnType<typeof getPendingTasks>>[number] }) {
  const statusColor =
    task.status === "overdue"
      ? "border-amber-300 bg-amber-50"
      : "border-emerald-300 bg-white";
  const statusBadge =
    task.status === "overdue" ? (
      <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded">באיחור</span>
    ) : (
      <span className="text-xs bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">החודש</span>
    );

  return (
    <div className={`border-2 rounded-lg p-4 ${statusColor}`}>
      <div className="flex items-start gap-3 mb-3">
        {task.treePhoto && (
          <Image
            src={task.treePhoto}
            alt={task.treeName}
            width={56}
            height={56}
            className="w-14 h-14 rounded-md object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold">{task.action}</p>
            {statusBadge}
          </div>
          <Link
            href={`/trees/${task.treeSlug}`}
            className="text-sm text-emerald-700 hover:underline"
          >
            {task.treeName}
          </Link>
          {task.description && (
            <p className="text-sm text-stone-600 mt-1">{task.description}</p>
          )}
        </div>
      </div>
      <form action={markTaskDone}>
        <input type="hidden" name="carePlanId" value={task.id} />
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-md py-2 text-sm font-medium"
        >
          ✓ סיימתי
        </button>
      </form>
    </div>
  );
}
