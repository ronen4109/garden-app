"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TreeDeciduous, CalendarDays, Plus } from "lucide-react";

const TABS = [
  { href: "/", label: "בית", icon: Home },
  { href: "/trees", label: "עצים", icon: TreeDeciduous },
  { href: "/calendar", label: "לוח שנה", icon: CalendarDays },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 px-5 pb-[max(env(safe-area-inset-bottom),0.875rem)] pointer-events-none">
      <div className="pointer-events-auto max-w-sm mx-auto glass rounded-2xl border border-border/70 shadow-soft grid grid-cols-4 px-2 py-1">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 py-2 text-[10px] transition-colors duration-200 ${
                active ? "text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-[19px]" strokeWidth={active ? 2.2 : 1.7} />
              {label}
            </Link>
          );
        })}
        <Link
          href="/log"
          className={`flex flex-col items-center gap-0.5 py-2 text-[10px] transition-colors duration-200 ${
            pathname.startsWith("/log")
              ? "text-foreground font-medium"
              : "text-muted-foreground"
          }`}
        >
          <span className="flex items-center justify-center size-[19px] rounded-full border border-current">
            <Plus className="size-3" strokeWidth={2.2} />
          </span>
          תיעוד
        </Link>
      </div>
    </nav>
  );
}
