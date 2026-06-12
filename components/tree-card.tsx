import Link from "next/link";
import Image from "next/image";
import type { TreeWithStatus } from "@/lib/garden";
import { relativeDaysHe } from "@/lib/garden";

export function TreeCard({ tree }: { tree: TreeWithStatus }) {
  return (
    <Link
      href={`/trees/${tree.slug}`}
      className="group relative block aspect-[4/5] rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-card"
    >
      {tree.photoUrl && (
        <Image
          src={tree.photoUrl}
          alt={tree.name}
          fill
          sizes="(max-width: 768px) 50vw, 350px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 p-5">
        {tree.species && (
          <p className="text-white/60 text-[10px] tracking-[0.22em] uppercase mb-1">
            {tree.species}
          </p>
        )}
        <h3 className="font-display text-2xl font-medium text-white tracking-tight">
          {tree.name}
        </h3>
        {tree.lastCaredAt && (
          <p className="text-white/70 text-xs mt-1.5">
            טופל {relativeDaysHe(tree.lastCaredAt)}
          </p>
        )}
      </div>
    </Link>
  );
}
