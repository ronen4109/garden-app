import Image from "next/image";
import { redirect } from "next/navigation";
import { getAllTrees } from "@/lib/tasks";
import { logActionForTrees } from "@/app/actions";
import { ActionIcon } from "@/components/action-icon";

export const dynamic = "force-dynamic";

const ACTIONS = ["דישון", "השקיה", "גיזום", "ריסוס", "חיפוי", "קטיף"];

export default async function LogPage() {
  const allTrees = await getAllTrees();
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  async function submit(formData: FormData) {
    "use server";
    await logActionForTrees(formData);
    redirect("/");
  }

  return (
    <div className="px-4 pt-8 space-y-6">
      <div className="reveal">
        <h1 className="font-display text-4xl font-black">תיעוד פעולה</h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          מה עשיתם בגינה? בחרו פעולה ועצים.
        </p>
      </div>

      <form
        action={submit}
        className="reveal space-y-6"
        style={{ "--reveal-delay": "140ms" } as React.CSSProperties}
      >
        <fieldset>
          <legend className="block text-sm font-bold mb-2">פעולה</legend>
          <div className="grid grid-cols-3 gap-2">
            {ACTIONS.map((a, i) => (
              <label key={a} className="cursor-pointer">
                <input
                  type="radio"
                  name="action"
                  value={a}
                  defaultChecked={i === 0}
                  className="peer sr-only"
                />
                <span className="flex flex-col items-center gap-1.5 bg-card border border-border rounded-2xl py-3.5 text-sm font-medium transition-colors peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary peer-checked:shadow-soft">
                  <ActionIcon action={a} className="size-5" />
                  {a}
                </span>
              </label>
            ))}
            <label className="cursor-pointer">
              <input
                type="radio"
                name="action"
                value="אחר"
                className="peer sr-only"
              />
              <span className="flex flex-col items-center justify-center gap-1.5 bg-card border border-dashed border-border rounded-2xl py-3.5 text-sm font-medium transition-colors peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary">
                ✦ אחר
              </span>
            </label>
          </div>
          <input
            type="text"
            name="customAction"
            placeholder="אם בחרתם ״אחר״ — תארו את הפעולה"
            className="mt-2 w-full bg-card border border-input rounded-2xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </fieldset>

        <div>
          <label htmlFor="log-date" className="block text-sm font-bold mb-2">
            תאריך
          </label>
          <input
            id="log-date"
            type="date"
            name="date"
            defaultValue={today}
            required
            className="w-full bg-card border border-input rounded-2xl p-3.5 text-base focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <fieldset>
          <legend className="block text-sm font-bold mb-2">
            עצים שטופלו
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {allTrees.map((tree) => (
              <label key={tree.id} className="cursor-pointer">
                <input
                  type="checkbox"
                  name="treeIds"
                  value={tree.id}
                  defaultChecked
                  className="peer sr-only"
                />
                <span className="flex items-center gap-2.5 bg-card border border-border rounded-2xl p-2.5 transition-colors peer-checked:border-primary peer-checked:bg-secondary">
                  {tree.photoUrl && (
                    <Image
                      src={tree.photoUrl}
                      alt={tree.name}
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover shrink-0"
                    />
                  )}
                  <span className="font-medium text-sm">{tree.name}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            כל העצים מסומנים — הסירו סימון מעצים שלא טופלו.
          </p>
        </fieldset>

        <div>
          <label htmlFor="log-note" className="block text-sm font-bold mb-2">
            הערה (לא חובה)
          </label>
          <textarea
            id="log-note"
            name="note"
            rows={3}
            placeholder="לדוגמה: 80 גרם אוסמוקוט סביב כל עץ והשקיה עמוקה"
            className="w-full bg-card border border-input rounded-2xl p-3.5 text-base focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-lg font-medium shadow-card transition-transform active:scale-[0.99]"
        >
          ✓ שמירה
        </button>
      </form>
    </div>
  );
}
