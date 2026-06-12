import Image from "next/image";
import { redirect } from "next/navigation";
import { getTreeBySlug } from "@/lib/tasks";
import { addObservation } from "@/app/actions";

export const dynamic = "force-dynamic";

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
    <div className="px-4 pt-8 space-y-6">
      <div className="reveal flex items-center gap-3">
        {tree.photoUrl && (
          <Image
            src={tree.photoUrl}
            alt={tree.name}
            width={56}
            height={56}
            className="size-14 rounded-full object-cover ring-2 ring-card shadow-soft"
          />
        )}
        <div>
          <h1 className="font-display text-2xl font-bold">תצפית חדשה</h1>
          <p className="text-sm text-muted-foreground">{tree.name}</p>
        </div>
      </div>

      <p
        className="reveal text-sm text-muted-foreground leading-relaxed"
        style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
      >
        מה שמתם לב? למשל: ״ראיתי כנימות על העלים״, ״פרי ראשון!״, ״נראה צמא״.
      </p>

      <form
        action={submit}
        className="reveal space-y-4"
        style={{ "--reveal-delay": "220ms" } as React.CSSProperties}
      >
        <input type="hidden" name="treeSlug" value={slug} />
        <textarea
          name="text"
          rows={5}
          required
          placeholder="התצפית שלכם..."
          className="w-full bg-card border border-input rounded-2xl p-4 text-base min-h-36 shadow-soft focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring"
        />
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground rounded-2xl py-4 text-lg font-medium shadow-card transition-transform active:scale-[0.99]"
        >
          שמירת תצפית
        </button>
      </form>
    </div>
  );
}
