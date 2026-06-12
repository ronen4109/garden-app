import type { Metadata, Viewport } from "next";
import { Heebo, Frank_Ruhl_Libre } from "next/font/google";
import Link from "next/link";
import { Sprout } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

const frank = Frank_Ruhl_Libre({
  variable: "--font-frank",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "הגינה שלנו",
  description: "תכנית טיפול לעצי הפרי בחצר",
};

export const viewport: Viewport = {
  themeColor: "#f8f5ed",
};

const NAV_LINKS = [
  { href: "/", label: "בית" },
  { href: "/trees", label: "העצים" },
  { href: "/calendar", label: "לוח השנה" },
] as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} ${frank.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Desktop header — hairline, editorial */}
        <header className="hidden md:block border-b border-border/70 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display text-xl font-medium tracking-tight"
            >
              <Sprout className="size-5 text-primary" strokeWidth={2} />
              הגינה שלנו
            </Link>
            <nav className="flex items-center gap-8 text-sm">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/log"
                className="border border-foreground/80 text-foreground rounded-full px-5 py-1.5 text-sm transition-colors duration-200 hover:bg-foreground hover:text-background"
              >
                + תיעוד
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 w-full max-w-6xl mx-auto pb-32 md:pb-20">
          {children}
        </main>
        <div className="md:hidden">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
