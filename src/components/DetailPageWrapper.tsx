"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Phase: enter → idle → closing-fade → closing-book → navigate
type Phase = "enter" | "idle" | "closing-fade" | "closing-book" | "done";

export function DetailPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<Phase>("enter");
  const router = useRouter();

  // Auto-advance from enter to idle after animation
  useEffect(() => {
    if (phase === "enter") {
      const t = setTimeout(() => setPhase("idle"), 800);
      return () => clearTimeout(t);
    }
    if (phase === "closing-fade") {
      const t = setTimeout(() => setPhase("closing-book"), 400);
      return () => clearTimeout(t);
    }
    if (phase === "closing-book") {
      const t = setTimeout(() => {
        setPhase("done");
        router.push("/");
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [phase, router]);

  // Intercept clicks on the back link
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Look for any link pointing to home
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (href !== "/") return;

      e.preventDefault();
      e.stopPropagation();
      if (phase === "idle") {
        setPhase("closing-fade");
      }
    },
    [phase]
  );

  const contentClass =
    phase === "enter"
      ? "detail-page-enter"
      : phase === "closing-fade" || phase === "closing-book" || phase === "done"
        ? "detail-page-exit"
        : "";

  return (
    <>
      <div className={contentClass} onClick={handleClick}>
        {children}
      </div>

      {/* Closing book overlay */}
      {(phase === "closing-book" || phase === "done") && (
        <div className="book-overlay" aria-hidden="true">
          <div className="book-backdrop" />
          <div className="book-glow book-glow-closing" />

          {/* Golden flash fading IN (reverse of opening) */}
          <div className="book-golden-unflash" />

          <div className="book-scene book-scene-closing">
            <div className="book-body">
              {/* Inner pages */}
              <div className="book-back-page">
                <div className="book-inner-page book-inner-left">
                  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="book-page-symbol book-page-symbol-visible">
                    <polygon points="50,10 59,38 90,38 65,56 74,84 50,68 26,84 35,56 10,38 41,38"
                      stroke="currentColor" strokeWidth="0.8" opacity="0.5" fill="currentColor" fillOpacity="0.05" />
                    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                  </svg>
                </div>
                <div className="book-inner-page book-inner-right">
                  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="book-page-symbol book-page-symbol-visible">
                    <path d="M60 20C45 20 33 32 33 47s12 27 27 27c4 0 8-1 11-2.5C65 68 60 60 60 50S65 32 71 28c-3-5-7-8-11-8z"
                      fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="0.5" />
                  </svg>
                </div>
              </div>

              {/* Cover closing */}
              <div className="book-cover book-cover-closing">
                <div className="book-cover-front">
                  <div className="book-cover-design">
                    <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="book-cover-svg">
                      <rect x="10" y="10" width="180" height="260" rx="3" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                      <rect x="18" y="18" width="164" height="244" rx="2" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
                      <circle cx="100" cy="115" r="52" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
                      <polygon points="100,65 111,97 145,97 117,117 128,149 100,130 72,149 83,117 55,97 89,97"
                        stroke="currentColor" strokeWidth="0.8" opacity="0.4" fill="currentColor" fillOpacity="0.05" />
                      <line x1="40" y1="188" x2="160" y2="188" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
                      <line x1="55" y1="198" x2="145" y2="198" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
                      <path d="M18 18 L38 18 M18 18 L18 38" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                      <path d="M182 18 L162 18 M182 18 L182 38" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                      <path d="M18 262 L38 262 M18 262 L18 242" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                      <path d="M182 262 L162 262 M182 262 L182 242" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                    </svg>
                  </div>
                </div>
                <div className="book-cover-back" />
              </div>

              <div className="book-spine-line" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
