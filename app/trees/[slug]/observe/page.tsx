import Link from "next/link";
import { redirect } from "next/navigation";
import { getTreeBySlug } from "@/lib/tasks";
import { addObservation } from "@/app/actions";

export default async function ObservePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tree = await getTreeBySlug(slug);
  if (!tree) redirect("/trees");

  async function submit(formData: FormData) {
    "use server";
    await addObservation(formData);
    redirect(`/trees/${slug}`);
  }

  return (
    <div className="space-y-4">
      <div>
        <Link
          href={`/trees/${slug}`}
          className="text-sm text-emerald-700 hover:underline"
        >
          ← חזרה ל{tree.name}
        </Link>
      </div>
      <h1 className="text-2xl font-bold">תצפית חדשה — {tree.name}</h1>
      <p className="text-stone-600 text-sm">
        מה שמת לב? למשל: "ראיתי כנימות על העלים", "פרי ראשון!", "נראה צמא".
      </p>
      <form action={submit} className="space-y-3">
        <input type="hidden" name="treeSlug" value={slug} />
        <textarea
          name="text"
          rows={5}
          required
          placeholder="התצפית שלך..."
          className="w-full border border-stone-300 rounded-lg p-3 text-base focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-3 font-medium"
        >
          שמור תצפית
        </button>
      </form>
    </div>
  );
}
