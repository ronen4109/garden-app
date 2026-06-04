import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllTrees } from "@/lib/tasks";
import { logActionForTrees } from "@/app/actions";

export const dynamic = "force-dynamic";

const ACTIONS = ["דישון", "השקיה", "גיזום", "ריסוס", "חיפוי", "קטיף", "אחר"];

export default async function LogPage() {
  const allTrees = await getAllTrees();
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

  async function submit(formData: FormData) {
    "use server";
    await logActionForTrees(formData);
    redirect("/");
  }

  return (
    <div className="space-y-5">
      <div>
        <Link href="/" className="text-sm text-emerald-700 hover:underline">
          ← חזרה לדף הבית
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold">תיעוד פעולה</h1>
        <p className="text-stone-600 text-sm mt-1">
          מה עשית בגינה? סמן את הפעולה ואת העצים שטיפלת בהם.
        </p>
      </div>

      <form action={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">פעולה</label>
          <select
            name="action"
            required
            defaultValue="דישון"
            className="w-full border border-stone-300 rounded-lg p-3 bg-white text-base"
          >
            {ACTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="customAction"
            placeholder='אם בחרת "אחר" — תאר את הפעולה'
            className="mt-2 w-full border border-stone-300 rounded-lg p-3 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">תאריך</label>
          <input
            type="date"
            name="date"
            defaultValue={today}
            required
            className="w-full border border-stone-300 rounded-lg p-3 text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            עצים — סמן את אלה שטיפלת
          </label>
          <div className="space-y-2">
            {allTrees.map((tree) => (
              <label
                key={tree.id}
                className="flex items-center gap-3 bg-white border border-stone-200 rounded-lg p-3 cursor-pointer hover:border-emerald-400"
              >
                <input
                  type="checkbox"
                  name="treeIds"
                  value={tree.id}
                  defaultChecked
                  className="w-5 h-5 accent-emerald-600"
                />
                <span className="font-medium flex-1">{tree.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            הערה (אופציונלי)
          </label>
          <textarea
            name="note"
            rows={3}
            placeholder="לדוגמה: שמתי 80 גרם אוסמוקוט סביב כל עץ והשקיתי"
            className="w-full border border-stone-300 rounded-lg p-3 text-base"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-3 font-medium text-lg"
        >
          ✓ שמור
        </button>
      </form>
    </div>
  );
}
