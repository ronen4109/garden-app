import { pgTable, uuid, text, timestamp, integer, date } from "drizzle-orm/pg-core";

export const trees = pgTable("trees", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  species: text("species"),
  photoUrl: text("photo_url"),
  plantedDate: date("planted_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const carePlanItems = pgTable("care_plan_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  treeId: uuid("tree_id")
    .references(() => trees.id, { onDelete: "cascade" })
    .notNull(),
  action: text("action").notNull(),
  description: text("description"),
  month: integer("month"),
  frequencyDays: integer("frequency_days"),
  season: text("season"),
});

export const taskLogs = pgTable("task_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  treeId: uuid("tree_id")
    .references(() => trees.id, { onDelete: "cascade" })
    .notNull(),
  carePlanId: uuid("care_plan_id").references(() => carePlanItems.id, {
    onDelete: "set null",
  }),
  action: text("action").notNull(),
  doneAt: timestamp("done_at").defaultNow().notNull(),
  note: text("note"),
});

export const observations = pgTable("observations", {
  id: uuid("id").defaultRandom().primaryKey(),
  treeId: uuid("tree_id")
    .references(() => trees.id, { onDelete: "cascade" })
    .notNull(),
  text: text("text").notNull(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Tree = typeof trees.$inferSelect;
export type CarePlanItem = typeof carePlanItems.$inferSelect;
export type TaskLog = typeof taskLogs.$inferSelect;
export type Observation = typeof observations.$inferSelect;
