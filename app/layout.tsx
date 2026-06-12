import type { Metadata, Viewport } from "next";
import { Heebo, Frank_Ruhl_Libre } from "next/font/google";
import { BottomNav } from "@/components/bottom-nav";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

const frank = Frank_Ruhl_Libre({
  variable: "--font-frank",
  subsets: ["hebrew", "latin"],
  weight: ["500", "700", "900"],
});

export const metadata: Metadata = {
  title: "הגינה שלנו",
  description: "תכנית טיפול לעצי הפרי בחצר",
};

export const viewport: Viewport = {
  themeColor: "#f7f1e5",
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
      className={`${heebo.variable} ${frank.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main className="flex-1 max-w-2xl w-full mx-auto pb-32">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
