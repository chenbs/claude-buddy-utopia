import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
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
      className={`${cormorantGaramond.variable} ${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 flex justify-between items-center h-16">
            <Link href="/" className="font-display text-xl font-light tracking-wide hover:opacity-60 transition-opacity duration-300">
              Buddy Utopia
            </Link>
            <Link
              href="/upload"
              className="btn-primary text-xs tracking-[0.15em] uppercase font-medium border border-foreground px-5 py-2 hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              Upload
            </Link>
          </div>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="h-px bg-card-border" />
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="py-12 mt-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="h-px bg-card-border mb-12" />
            <p className="text-muted text-xs tracking-[0.2em] uppercase">
              Buddy Utopia
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
