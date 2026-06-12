import Link from "next/link";
import Image from "next/image";
import type { TreeWithStatus } from "@/lib/garden";
import { relativeDaysHe } from "@/lib/garden";

export function TreeCard({ tree }: { tree: TreeWithStatus }) {
  return (
    <Link
      href={`/trees/${tree.slug}`}
      className="group relative block aspect-[4/5] rounded-3xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {tree.photoUrl && (
        <Image
          src={tree.photoUrl}
          alt={tree.name}
          fill
          sizes="(max-width: 672px) 50vw, 336px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
      <div className="absolute bottom-0 inset-x-0 p-4 transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="font-display text-2xl font-black text-white">
          {tree.name}
        </h3>
        {tree.species && (
          <p className="text-white/65 text-xs italic mb-1.5">{tree.species}</p>
        )}
        {tree.lastCaredAt && (
          <span className="inline-block glass !bg-white/20 text-white rounded-full px-2.5 py-0.5 text-[11px]">
            טופל {relativeDaysHe(tree.lastCaredAt)}
          </span>
        )}
      </div>
    </Link>
  );
}
