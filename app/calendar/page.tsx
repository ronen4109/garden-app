import Link from "next/link";
import Image from "next/image";
import { getTasksForMonth, HEBREW_MONTHS } from "@/lib/tasks";

export const dynamic = "force-dynamic";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const now = new Date();
  const selectedMonth = monthParam ? parseInt(monthParam, 10) : now.getMonth() + 1;

  const tasks = await getTasksForMonth(selectedMonth);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">לוח שנה</h1>

      <div className="grid grid-cols-4 gap-2">
        {HEBREW_MONTHS.map((m, idx) => {
          const monthNum = idx + 1;
          const isSelected = monthNum === selectedMonth;
          const isCurrent = monthNum === now.getMonth() + 1;
          return (
            <Link
              key={m}
              href={`/calendar?month=${monthNum}`}
              className={`text-center py-2 rounded-md text-sm font-medium border ${
                isSelected
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : isCurrent
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : "bg-white border-stone-200 hover:border-emerald-300"
              }`}
            >
              {m}
            </Link>
          );
        })}
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          משימות ל{HEBREW_MONTHS[selectedMonth - 1]}
          {selectedMonth === now.getMonth() + 1 && (
            <span className="text-sm font-normal text-stone-500 mr-2">(החודש)</span>
          )}
        </h2>
        {tasks.length === 0 ? (
          <p className="text-stone-500 text-sm">אין משימות בחודש הזה.</p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white border rounded-lg p-3 flex items-center gap-3 ${
                  task.doneAt ? "border-stone-200 opacity-60" : "border-stone-200"
                }`}
              >
                {task.treePhoto && (
                  <Image
                    src={task.treePhoto}
                    alt={task.treeName}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {task.doneAt && "✓ "}
                    {task.action}
                  </p>
                  <Link
                    href={`/trees/${task.treeSlug}`}
                    className="text-xs text-emerald-700 hover:underline"
                  >
                    {task.treeName}
                  </Link>
                </div>
                {task.doneAt && (
                  <span className="text-xs text-stone-500 whitespace-nowrap">
                    {new Date(task.doneAt).toLocaleDateString("he-IL")}
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
