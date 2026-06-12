import { db } from "@/db";
import { trees, carePlanItems, taskLogs, observations } from "@/db/schema";
import type { Tree, TaskLog, Observation } from "@/db/schema";
import { desc, eq, gte } from "drizzle-orm";

export type JournalEntry =
  | { kind: "log"; id: string; action: string; note: string | null; date: Date }
  | { kind: "observation"; id: string; text: string; date: Date };

export function mergeJournal(
  logs: TaskLog[],
  obs: Observation[]
): JournalEntry[] {
  const entries: JournalEntry[] = [
    ...logs.map((l) => ({
      kind: "log" as const,
      id: l.id,
      action: l.action,
      note: l.note,
      date: l.doneAt,
    })),
    ...obs.map((o) => ({
      kind: "observation" as const,
      id: o.id,
      text: o.text,
      date: o.createdAt,
    })),
  ];
  entries.sort((a, b) => b.date.getTime() - a.date.getTime());
  return entries;
}

export async function getObservations(treeId: string) {
  return db
    .select()
    .from(observations)
    .where(eq(observations.treeId, treeId))
    .orderBy(desc(observations.createdAt))
    .limit(20);
}

export type TreeWithStatus = Tree & {
  lastCaredAt: Date | null;
  lastAction: string | null;
};

export async function getTreesWithStatus(): Promise<TreeWithStatus[]> {
  const allTrees = await db.select().from(trees).orderBy(trees.name);
  const logs = await db
    .select({
      treeId: taskLogs.treeId,
      action: taskLogs.action,
      doneAt: taskLogs.doneAt,
    })
    .from(taskLogs)
    .orderBy(desc(taskLogs.doneAt));

  const latest = new Map<string, { action: string; doneAt: Date }>();
  for (const log of logs) {
    if (!latest.has(log.treeId)) {
      latest.set(log.treeId, { action: log.action, doneAt: log.doneAt });
    }
  }

  return allTrees.map((t) => ({
    ...t,
    lastCaredAt: latest.get(t.id)?.doneAt ?? null,
    lastAction: latest.get(t.id)?.action ?? null,
  }));
}

export type MonthSummary = { month: number; total: number; done: number };

export async function getMonthSummaries(): Promise<MonthSummary[]> {
  const items = await db
    .select({ id: carePlanItems.id, month: carePlanItems.month })
    .from(carePlanItems);

  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const logs = await db
    .select({ carePlanId: taskLogs.carePlanId })
    .from(taskLogs)
    .where(gte(taskLogs.doneAt, yearStart));

  const doneSet = new Set(logs.map((l) => l.carePlanId).filter(Boolean));

  const summaries: MonthSummary[] = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    total: 0,
    done: 0,
  }));

  for (const item of items) {
    if (!item.month) continue;
    const s = summaries[item.month - 1];
    s.total++;
    if (doneSet.has(item.id)) s.done++;
  }

  return summaries;
}

export type SeasonContext = {
  label: string;
  line: string;
  icon: "sun" | "leaf" | "flower" | "rain";
};

const SEASON_BY_MONTH: Record<number, SeasonContext> = {
  1: { label: "חורף", line: "עונת הגיזום והריסוסים — העצים הנשירים ישנים", icon: "rain" },
  2: { label: "חורף", line: "סוף החורף — אחרון הריסוסים לפני ההתעוררות", icon: "rain" },
  3: { label: "אביב", line: "הגינה מתעוררת — זמן דישון ההדרים", icon: "flower" },
  4: { label: "אביב", line: "פריחה בכל מקום — ריסוסי מנע לפני החנטה", icon: "flower" },
  5: { label: "אביב", line: "החנטה בעיצומה — דישון ודילול פרי", icon: "flower" },
  6: { label: "קיץ", line: "שיא הקיץ מתקרב — השקיה היא שם המשחק", icon: "sun" },
  7: { label: "קיץ", line: "חם ויבש — חיפוי והשקיה עמוקה לכל העצים", icon: "sun" },
  8: { label: "קיץ", line: "עונת הקטיף — המנגו מבשיל", icon: "sun" },
  9: { label: "סתיו", line: "סוף הקיץ — קוטפים אפרסקים ומנגו", icon: "leaf" },
  10: { label: "סתיו", line: "מפחיתים השקיה בהדרגה — הגינה נרגעת", icon: "leaf" },
  11: { label: "סתיו", line: "דישון סתיו וקומפוסט — הכנות לחורף", icon: "leaf" },
  12: { label: "חורף", line: "עונת ההדרים — קלמנטינות ולימונים מבשילים", icon: "rain" },
};

export function getSeasonContext(month: number): SeasonContext {
  return SEASON_BY_MONTH[month] ?? SEASON_BY_MONTH[6];
}

export function relativeDaysHe(date: Date): string {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfThen = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round(
    (startOfToday.getTime() - startOfThen.getTime()) / 86_400_000
  );

  if (days <= 0) return "היום";
  if (days === 1) return "אתמול";
  if (days < 7) return `לפני ${days} ימים`;
  if (days < 14) return "לפני שבוע";
  if (days < 30) return `לפני ${Math.round(days / 7)} שבועות`;
  if (days < 60) return "לפני חודש";
  return `לפני ${Math.round(days / 30)} חודשים`;
}
