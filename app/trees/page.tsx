import { getTreesWithStatus } from "@/lib/garden";
import { TreeCard } from "@/components/tree-card";

export const dynamic = "force-dynamic";

export default async function TreesPage() {
  const trees = await getTreesWithStatus();

  return (
    <div className="px-4 md:px-8 pt-8 md:pt-14 max-w-5xl mx-auto space-y-8">
      <div className="reveal">
        <p className="text-[11px] tracking-[0.22em] text-muted-foreground mb-1.5">
          {trees.length} עצי פרי בחצר
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight">
          העצים שלנו
        </h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
        {trees.map((tree, i) => (
          <div
            key={tree.id}
            className="reveal"
            style={
              { "--reveal-delay": `${140 + i * 70}ms` } as React.CSSProperties
            }
          >
            <TreeCard tree={tree} />
          </div>
        ))}
      </div>
    </div>
  );
}
