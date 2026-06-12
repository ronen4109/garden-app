import Link from "next/link";
import Image from "next/image";
import type { PendingTask } from "@/lib/tasks";
import { HEBREW_MONTHS } from "@/lib/tasks";
import { markTaskDone } from "@/app/actions";
import { ActionIcon } from "./action-icon";
import { DoneButton } from "./done-button";

export function TaskCard({
  task,
  showTree = true,
}: {
  task: PendingTask;
  showTree?: boolean;
}) {
  const overdue = task.status === "overdue";

  return (
    <div className="bg-card border border-border/80 rounded-xl p-5 transition-shadow duration-300 hover:shadow-soft">
      <div className="flex items-start gap-4">
        {showTree && task.treePhoto ? (
          <Link href={`/trees/${task.treeSlug}`} className="shrink-0">
            <Image
              src={task.treePhoto}
              alt={task.treeName}
              width={56}
              height={56}
              className="size-14 rounded-lg object-cover"
            />
          </Link>
        ) : (
          <span className="flex items-center justify-center size-11 rounded-lg bg-muted text-muted-foreground shrink-0">
            <ActionIcon action={task.action} className="size-5" strokeWidth={1.75} />
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-display text-lg font-medium">{task.action}</p>
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] tracking-wide whitespace-nowrap ${
                overdue ? "text-terracotta" : "text-leaf"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  overdue ? "bg-terracotta" : "bg-leaf"
                }`}
              />
              {overdue ? HEBREW_MONTHS[task.month - 1] : "החודש"}
            </span>
          </div>
          {showTree && (
            <Link
              href={`/trees/${task.treeSlug}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {task.treeName}
            </Link>
          )}
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              {task.description}
            </p>
          )}
          <div className="mt-3.5">
            <form action={markTaskDone}>
              <input type="hidden" name="carePlanId" value={task.id} />
              <DoneButton />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
