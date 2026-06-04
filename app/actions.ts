"use server";

import { db } from "@/db";
import { taskLogs, observations, carePlanItems, trees } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function markTaskDone(formData: FormData) {
  const carePlanId = formData.get("carePlanId") as string;
  const note = (formData.get("note") as string) || null;

  const item = await db
    .select()
    .from(carePlanItems)
    .where(eq(carePlanItems.id, carePlanId))
    .limit(1);

  if (!item[0]) throw new Error("משימה לא נמצאה");

  await db.insert(taskLogs).values({
    treeId: item[0].treeId,
    carePlanId: item[0].id,
    action: item[0].action,
    note,
  });

  revalidatePath("/");
  revalidatePath("/trees");
  revalidatePath("/calendar");

  const tree = await db
    .select()
    .from(trees)
    .where(eq(trees.id, item[0].treeId))
    .limit(1);
  if (tree[0]) revalidatePath(`/trees/${tree[0].slug}`);
}

export async function addObservation(formData: FormData) {
  const treeSlug = formData.get("treeSlug") as string;
  const text = formData.get("text") as string;

  if (!text?.trim()) return;

  const tree = await db
    .select()
    .from(trees)
    .where(eq(trees.slug, treeSlug))
    .limit(1);

  if (!tree[0]) throw new Error("עץ לא נמצא");

  await db.insert(observations).values({
    treeId: tree[0].id,
    text: text.trim(),
  });

  revalidatePath(`/trees/${treeSlug}`);
}

export async function logActionForTrees(formData: FormData) {
  const action = formData.get("action") as string;
  const customAction = (formData.get("customAction") as string)?.trim();
  const date = formData.get("date") as string;
  const note = (formData.get("note") as string)?.trim() || null;
  const treeIds = formData.getAll("treeIds") as string[];

  const finalAction = action === "אחר" && customAction ? customAction : action;

  if (!finalAction || treeIds.length === 0) {
    throw new Error("חסרים פרטים: פעולה או עצים");
  }

  const doneAt = date ? new Date(date + "T12:00:00") : new Date();
  const monthOfAction = doneAt.getMonth() + 1;

  for (const treeId of treeIds) {
    const matching = await db
      .select()
      .from(carePlanItems)
      .where(
        and(
          eq(carePlanItems.treeId, treeId),
          eq(carePlanItems.action, finalAction),
          eq(carePlanItems.month, monthOfAction)
        )
      )
      .limit(1);

    await db.insert(taskLogs).values({
      treeId,
      carePlanId: matching[0]?.id ?? null,
      action: finalAction,
      doneAt,
      note,
    });
  }

  revalidatePath("/");
  revalidatePath("/trees");
  revalidatePath("/calendar");

  const touched = await db
    .select()
    .from(trees)
    .where(inArray(trees.id, treeIds));
  for (const t of touched) {
    revalidatePath(`/trees/${t.slug}`);
  }
}
