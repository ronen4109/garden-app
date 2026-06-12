import Link from "next/link";
import Image from "next/image";
import { CircleAlert, CalendarCheck } from "lucide-react";
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
    <div className="bg-card rounded-2xl p-4 shadow-card">
      <div className="flex items-start gap-3 mb-3">
        {showTree && task.treePhoto ? (
          <Link href={`/trees/${task.treeSlug}`} className="shrink-0">
            <Image
              src={task.treePhoto}
              alt={task.treeName}
              width={64}
              height={64}
              className="size-16 rounded-xl object-cover"
            />
          </Link>
        ) : (
          <span
            className={`flex items-center justify-center size-11 rounded-xl shrink-0 ${
              overdue
                ? "bg-terracotta-soft text-terracotta"
                : "bg-leaf-soft text-leaf"
            }`}
          >
            <ActionIcon action={task.action} className="size-5" />
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold">{task.action}</p>
            {overdue ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-terracotta-soft text-terracotta px-2 py-0.5 rounded-full">
                <CircleAlert className="size-3" />
                {HEBREW_MONTHS[task.month - 1]}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-leaf-soft text-leaf px-2 py-0.5 rounded-full">
                <CalendarCheck className="size-3" />
                החודש
              </span>
            )}
          </div>
          {showTree && (
            <Link
              href={`/trees/${task.treeSlug}`}
              className="text-sm text-primary font-medium hover:underline"
            >
              {task.treeName}
            </Link>
          )}
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>
      <form action={markTaskDone}>
        <input type="hidden" name="carePlanId" value={task.id} />
        <DoneButton />
      </form>
    </div>
  );
}
