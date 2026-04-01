import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Navigation */}
        <nav className="border-b border-card-border bg-card-bg/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-accent transition-colors"
              >
                <span className="text-2xl">🏠</span>
                <span>Buddy Utopia</span>
              </Link>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                <span className="text-lg">+</span>
                Upload Buddy
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-card-border py-6 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-muted text-sm">
            <p>
              Buddy Utopia — A home for every Claude buddy ✨
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
