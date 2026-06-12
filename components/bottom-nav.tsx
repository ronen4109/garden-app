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
    <nav className="fixed bottom-0 inset-x-0 z-20 px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pointer-events-none">
      <div className="pointer-events-auto max-w-md mx-auto glass rounded-full shadow-card border border-white/50 grid grid-cols-4 px-2 py-1.5">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-0.5 py-1.5 rounded-full text-[10px] font-medium transition-all duration-300 ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                className={`flex items-center justify-center size-8 rounded-full transition-all duration-300 ${
                  active ? "bg-primary/12 scale-110" : ""
                }`}
              >
                <Icon className="size-[19px]" strokeWidth={active ? 2.4 : 2} />
              </span>
              {label}
            </Link>
          );
        })}
        <Link
          href="/log"
          className={`relative flex flex-col items-center gap-0.5 py-1.5 rounded-full text-[10px] font-medium transition-all duration-300 ${
            pathname.startsWith("/log")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground shadow-soft transition-transform duration-300 active:scale-90">
            <Plus className="size-4" strokeWidth={2.75} />
          </span>
          תיעוד
        </Link>
      </div>
    </nav>
  );
}
