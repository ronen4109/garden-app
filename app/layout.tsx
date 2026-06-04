import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "הגינה שלנו",
  description: "תכנית טיפול לעצי הפרי בחצר",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-stone-50 text-stone-900">
        <header className="border-b border-stone-200 bg-white">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-emerald-700">
              🌳 הגינה שלנו
            </Link>
            <nav className="flex gap-4 text-sm items-center">
              <Link href="/trees" className="hover:text-emerald-700">עצים</Link>
              <Link href="/calendar" className="hover:text-emerald-700">לוח שנה</Link>
              <Link
                href="/log"
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md px-3 py-1.5 font-medium"
              >
                + תיעוד
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
