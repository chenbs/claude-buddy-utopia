import type { Metadata } from "next";
import { Cinzel, Crimson_Text, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { MagicDivider } from "@/components/MagicElements";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Buddy Utopia - Claude Buddy Showcase",
  description:
    "A gallery where everyone can upload and showcase their Claude Code buddies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${crimsonText.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-card-border/50">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 flex justify-between items-center h-16">
            <Link href="/" className="group flex items-center gap-3">
              <span className="text-highlight text-lg">&#x2726;</span>
              <span className="font-display text-base sm:text-lg tracking-[0.12em] uppercase font-medium group-hover:text-accent transition-colors duration-300">
                Buddy Utopia
              </span>
              <span className="text-highlight text-lg">&#x2726;</span>
            </Link>
            <Link
              href="/upload"
              className="btn-magic text-xs font-display tracking-[0.15em] uppercase border border-accent/60 text-accent px-5 py-2 hover:bg-accent hover:text-background transition-colors duration-300"
            >
              Summon
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="py-10 mt-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <MagicDivider className="mb-8" />
            <p className="font-display text-xs tracking-[0.25em] uppercase text-muted">
              Buddy Utopia &mdash; A Magical Home for Every Companion
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
