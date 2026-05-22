import { db } from "@/db";
import { trees, carePlanItems, taskLogs } from "@/db/schema";
import { and, desc, eq, gte, sql } from "drizzle-orm";

export const HEBREW_MONTHS = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

export type PendingTask = {
  id: string;
  treeId: string;
  treeName: string;
  treeSlug: string;
  treePhoto: string | null;
  action: string;
  description: string | null;
  month: number;
  status: "overdue" | "current" | "upcoming";
};

function startOfYear() {
  return new Date(new Date().getFullYear(), 0, 1);
}

export async function getPendingTasks(): Promise<PendingTask[]> {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;

  const allItems = await db
    .select({
      id: carePlanItems.id,
      treeId: carePlanItems.treeId,
      action: carePlanItems.action,
      description: carePlanItems.description,
      month: carePlanItems.month,
      treeName: trees.name,
      treeSlug: trees.slug,
      treePhoto: trees.photoUrl,
    })
    .from(carePlanItems)
    .innerJoin(trees, eq(trees.id, carePlanItems.treeId));

  const doneThisYear = await db
    .select({ carePlanId: taskLogs.carePlanId })
    .from(taskLogs)
    .where(gte(taskLogs.doneAt, startOfYear()));

  const doneSet = new Set(doneThisYear.map((d) => d.carePlanId).filter(Boolean));

  const pending: PendingTask[] = allItems
    .filter((item) => item.month !== null && !doneSet.has(item.id))
    .map((item) => {
      const month = item.month!;
      let status: PendingTask["status"];
      if (month < currentMonth) status = "overdue";
      else if (month === currentMonth) status = "current";
      else status = "upcoming";
      return {
        id: item.id,
        treeId: item.treeId,
        treeName: item.treeName,
        treeSlug: item.treeSlug,
        treePhoto: item.treePhoto,
        action: item.action,
        description: item.description,
        month,
        status,
      };
    });

  pending.sort((a, b) => {
    const order = { overdue: 0, current: 1, upcoming: 2 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return a.month - b.month;
  });

  return pending;
}

export async function getTasksForMonth(month: number) {
  const items = await db
    .select({
      id: carePlanItems.id,
      treeId: carePlanItems.treeId,
      action: carePlanItems.action,
      description: carePlanItems.description,
      treeName: trees.name,
      treeSlug: trees.slug,
      treePhoto: trees.photoUrl,
    })
    .from(carePlanItems)
    .innerJoin(trees, eq(trees.id, carePlanItems.treeId))
    .where(eq(carePlanItems.month, month));

  const doneThisYear = await db
    .select({ carePlanId: taskLogs.carePlanId, doneAt: taskLogs.doneAt })
    .from(taskLogs)
    .where(gte(taskLogs.doneAt, startOfYear()));

  const doneMap = new Map(
    doneThisYear
      .filter((d) => d.carePlanId)
      .map((d) => [d.carePlanId as string, d.doneAt as Date])
  );

  return items.map((item) => ({
    ...item,
    doneAt: doneMap.get(item.id) ?? null,
  }));
}

export async function getAllTrees() {
  return await db.select().from(trees).orderBy(trees.name);
}

export async function getTreeBySlug(slug: string) {
  const result = await db
    .select()
    .from(trees)
    .where(eq(trees.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

export async function getTreeData(slug: string) {
  const tree = await getTreeBySlug(slug);
  if (!tree) return null;

  const plan = await db
    .select()
    .from(carePlanItems)
    .where(eq(carePlanItems.treeId, tree.id))
    .orderBy(carePlanItems.month);

  const logs = await db
    .select()
    .from(taskLogs)
    .where(eq(taskLogs.treeId, tree.id))
    .orderBy(desc(taskLogs.doneAt))
    .limit(20);

  const doneSet = new Set<string>();
  const yearStart = startOfYear();
  for (const log of logs) {
    if (log.carePlanId && log.doneAt >= yearStart) {
      doneSet.add(log.carePlanId);
    }
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const pending = plan
    .filter((p) => p.month !== null && !doneSet.has(p.id))
    .map((p) => ({
      ...p,
      status:
        p.month! < currentMonth
          ? "overdue"
          : p.month! === currentMonth
            ? "current"
            : "upcoming",
    }));

  return { tree, plan, logs, pending };
}
