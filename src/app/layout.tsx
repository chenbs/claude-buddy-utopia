import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
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
    <html lang="en" className={`${vt323.variable} h-full`}>
      <body className="win2k-desktop-bg min-h-full flex flex-col">
        {/* Win2K Taskbar (top) */}
        <nav className="win2k-taskbar">
          <div className="max-w-6xl mx-auto px-2 flex justify-between items-center h-full">
            <Link href="/" className="win2k-start-btn">
              <span className="font-bold italic mr-1">B</span>
              Buddy Utopia
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/upload" className="win2k-taskbar-btn">
                + Upload Buddy
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer / Status */}
        <footer className="win2k-taskbar border-t-2 border-white/60 mt-auto">
          <div className="max-w-6xl mx-auto px-4 flex items-center h-full text-xs">
            <p>Buddy Utopia — A home for every Claude buddy</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
