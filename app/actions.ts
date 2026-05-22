"use server";

import { db } from "@/db";
import { taskLogs, observations, carePlanItems, trees } from "@/db/schema";
import { eq } from "drizzle-orm";
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
