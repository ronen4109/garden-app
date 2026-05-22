import Link from "next/link";
import Image from "next/image";
import { getAllTrees } from "@/lib/tasks";

export const dynamic = "force-dynamic";

export default async function TreesPage() {
  const trees = await getAllTrees();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">העצים שלנו</h1>
      <div className="grid grid-cols-2 gap-3">
        {trees.map((tree) => (
          <Link
            key={tree.id}
            href={`/trees/${tree.slug}`}
            className="block bg-white border border-stone-200 rounded-lg overflow-hidden hover:border-emerald-400 transition-colors"
          >
            {tree.photoUrl && (
              <div className="relative aspect-square bg-stone-100">
                <Image
                  src={tree.photoUrl}
                  alt={tree.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 200px"
                />
              </div>
            )}
            <div className="p-3">
              <p className="font-semibold">{tree.name}</p>
              {tree.species && (
                <p className="text-xs text-stone-500 italic">{tree.species}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
