import { getTreesWithStatus } from "@/lib/garden";
import { TreeCard } from "@/components/tree-card";

export const dynamic = "force-dynamic";

export default async function TreesPage() {
  const trees = await getTreesWithStatus();

  return (
    <div className="px-4 pt-8 space-y-6">
      <div className="reveal">
        <h1 className="font-display text-4xl font-black">העצים שלנו</h1>
        <p className="text-muted-foreground text-sm mt-1.5">
          {trees.length} עצי פרי בחצר
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {trees.map((tree, i) => (
          <div
            key={tree.id}
            className="reveal"
            style={
              { "--reveal-delay": `${120 + i * 80}ms` } as React.CSSProperties
            }
          >
            <TreeCard tree={tree} />
          </div>
        ))}
      </div>
    </div>
  );
}
