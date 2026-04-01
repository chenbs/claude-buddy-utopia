import type { Metadata } from "next";
import { Instrument_Serif, Space_Grotesk, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
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
      className={`${instrumentSerif.variable} ${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Navigation */}
        <nav className="border-b border-card-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="flex justify-between items-center h-18">
              <Link
                href="/"
                className="flex items-baseline gap-2 group"
              >
                <span className="font-display text-2xl italic text-foreground group-hover:text-accent transition-colors duration-300">
                  Buddy Utopia
                </span>
              </Link>
              <Link
                href="/upload"
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-full text-sm font-medium tracking-wide uppercase"
              >
                <span className="text-base leading-none">+</span>
                Upload
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-card-border/40 py-8 mt-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="font-display italic text-muted text-lg">
              A home for every Claude buddy
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
