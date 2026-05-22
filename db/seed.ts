import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { trees, carePlanItems } from "./schema";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client);

type TreeSeed = {
  slug: string;
  name: string;
  species: string;
  photoUrl: string;
  notes: string;
  plan: { action: string; description: string; month: number }[];
};

const TREES: TreeSeed[] = [
  {
    slug: "pomegranate",
    name: "רימון",
    species: "Punica granatum",
    photoUrl: "/trees/pomegranate.jpeg",
    notes: "עץ קשוח, סובל יובש. אוהב אשלגן.",
    plan: [
      { action: "דישון", description: "חופן דשן איטי-שחרור (50-80 גרם) סביב הגזע, להרחיק 20 ס\"מ ממנו. להשקות חזק.", month: 5 },
      { action: "חיפוי", description: "לחדש שכבת חיפוי 5-7 ס\"מ סביב העץ.", month: 6 },
      { action: "דישון", description: "חופן דשן + שכבת קומפוסט סביב העץ.", month: 11 },
      { action: "גיזום", description: "הסרת יונקים, ענפים פנימה, ענפים יבשים. ליצור צורת גביע פתוח.", month: 1 },
      { action: "ריסוס", description: "שמן חורף + גופרית — נגד מזיקים רדומים.", month: 1 },
    ],
  },
  {
    slug: "peach",
    name: "אפרסק",
    species: "Prunus persica",
    photoUrl: "/trees/peach.jpeg",
    notes: "העץ הכי דורש. רגיש למחלות פטרייתיות. חובה ריסוס חורף.",
    plan: [
      { action: "דישון", description: "חופן דשן איטי-שחרור.", month: 5 },
      { action: "דילול פרי", description: "להסיר פירות קטנים מדי כדי שהנשארים יגדלו טוב.", month: 5 },
      { action: "חיפוי", description: "לחדש חיפוי. אפרסק שותה הרבה — חיפוי חיוני.", month: 7 },
      { action: "קטיף", description: "אפרסקים מבשילים.", month: 9 },
      { action: "דישון", description: "קומפוסט + חופן דשן.", month: 11 },
      { action: "גיזום עיקרי", description: "להוריד 30% מהענפים. צורת גביע פתוח.", month: 12 },
      { action: "ריסוס חורף", description: "חובה. שמן חורף + גופרית — נגד פטריות וכנימות.", month: 1 },
      { action: "ריסוס נוסף", description: "שמן + גופרית, שבועיים אחרי הראשון.", month: 2 },
    ],
  },
  {
    slug: "mango",
    name: "מנגו",
    species: "Mangifera indica",
    photoUrl: "/trees/mango.jpeg",
    notes: "לא עמיד לקור — אם לילות מתחת ל-5 מעלות, לכסות. ניקוז טוב חיוני.",
    plan: [
      { action: "דישון", description: "דשן עתיר חנקן לעלים החדשים.", month: 4 },
      { action: "בדיקת ברזל", description: "אם העלים החדשים מצהיבים בין העורקים — לתת ברזל בכלאט (Fe-EDDHA).", month: 5 },
      { action: "חיפוי", description: "חיפוי עבה — מנגו אוהב סביבה לחה ומחוממת.", month: 7 },
      { action: "קטיף", description: "מנגו מבשיל.", month: 8 },
      { action: "בדיקת קור", description: "אם צפויים לילות מתחת ל-5 מעלות, לכסות בעץ ביריעה.", month: 11 },
      { action: "גיזום קל", description: "רק ענפים יבשים או מוצלבים. לא גיזום חזק.", month: 3 },
    ],
  },
  {
    slug: "clementine",
    name: "קלמנטינה",
    species: "Citrus clementina",
    photoUrl: "/trees/clementine.jpeg",
    notes: "להרחיק טפטפות 30 ס\"מ מהגזע. אם עלים צהובים — ברזל בכלאט.",
    plan: [
      { action: "דישון אביב", description: "דשן הדרים ייעודי, חופן סביב הגזע.", month: 3 },
      { action: "ריסוס מונע", description: "שמן קיץ נגד כנימות לפני פריחה.", month: 4 },
      { action: "חיפוי", description: "חידוש שכבה.", month: 7 },
      { action: "דישון סתיו", description: "חופן דשן הדרים.", month: 11 },
      { action: "קטיף", description: "קלמנטינות מבשילות בחורף.", month: 12 },
      { action: "גיזום קל", description: "רק ענפים פנימה ויבשים. הדרים לא צריכים גיזום חזק.", month: 2 },
    ],
  },
  {
    slug: "orange",
    name: "תפוז",
    species: "Citrus sinensis",
    photoUrl: "/trees/orange.jpeg",
    notes: "להרחיק טפטפות 30 ס\"מ מהגזע. דורש 30-40 ליטר ביום בקיץ.",
    plan: [
      { action: "דישון אביב", description: "דשן הדרים, חופן סביב הגזע.", month: 3 },
      { action: "ריסוס מונע", description: "שמן קיץ נגד כנימות.", month: 4 },
      { action: "חיפוי", description: "חידוש שכבה.", month: 7 },
      { action: "דישון סתיו", description: "חופן דשן הדרים.", month: 11 },
      { action: "קטיף", description: "תפוזים מבשילים בחורף.", month: 1 },
      { action: "גיזום קל", description: "ענפים פנימה ויבשים.", month: 2 },
    ],
  },
  {
    slug: "lemon",
    name: "לימון",
    species: "Citrus limon",
    photoUrl: "/trees/lemon.jpeg",
    notes: "נושא פרי כמעט כל השנה. לקטוף כשהפרי צהוב.",
    plan: [
      { action: "דישון אביב", description: "דשן הדרים.", month: 3 },
      { action: "ריסוס מונע", description: "שמן קיץ נגד כנימות.", month: 4 },
      { action: "חיפוי", description: "חידוש שכבה.", month: 7 },
      { action: "דישון סתיו", description: "חופן דשן הדרים.", month: 11 },
      { action: "גיזום קל", description: "רק לעיצוב, להסרת ענפים יבשים.", month: 2 },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  await db.delete(carePlanItems);
  await db.delete(trees);

  for (const t of TREES) {
    const [inserted] = await db
      .insert(trees)
      .values({
        slug: t.slug,
        name: t.name,
        species: t.species,
        photoUrl: t.photoUrl,
        notes: t.notes,
      })
      .returning();

    for (const p of t.plan) {
      await db.insert(carePlanItems).values({
        treeId: inserted.id,
        action: p.action,
        description: p.description,
        month: p.month,
      });
    }
    console.log(`  ✓ ${t.name} (${t.plan.length} משימות)`);
  }

  console.log("✅ Done!");
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
