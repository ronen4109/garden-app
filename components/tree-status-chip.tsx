import Link from "next/link";
import Image from "next/image";
import type { TreeWithStatus } from "@/lib/garden";
import { relativeDaysHe } from "@/lib/garden";

function statusColor(lastCaredAt: Date | null): string {
  if (!lastCaredAt) return "text-terracotta";
  const days = (Date.now() - lastCaredAt.getTime()) / 86_400_000;
  if (days <= 14) return "text-leaf";
  if (days <= 45) return "text-harvest";
  return "text-terracotta";
}

export function TreeStatusChip({ tree }: { tree: TreeWithStatus }) {
  return (
    <Link
      href={`/trees/${tree.slug}`}
      className="flex flex-col items-center gap-1.5 shrink-0 snap-start w-20"
    >
      {tree.photoUrl && (
        <Image
          src={tree.photoUrl}
          alt={tree.name}
          width={56}
          height={56}
          className="size-14 rounded-full object-cover ring-2 ring-card shadow-soft"
        />
      )}
      <span className="text-xs font-medium">{tree.name}</span>
      <span
        className={`text-[10px] leading-tight text-center ${statusColor(tree.lastCaredAt)}`}
      >
        {tree.lastCaredAt ? relativeDaysHe(tree.lastCaredAt) : "טרם טופל"}
      </span>
    </Link>
  );
}
