"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function DetailPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<"enter" | "idle" | "closing">("enter");
  const router = useRouter();

  // After entrance animation finishes, go idle
  const handleEntryEnd = useCallback(() => {
    setPhase("idle");
  }, []);

  // Intercept "Return to Archive" clicks
  const handleBackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const anchor = (e.target as HTMLElement).closest(
        'a[href="/"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      e.preventDefault();
      setPhase("closing");

      // Wait for closing animation, then navigate
      setTimeout(() => {
        router.push("/");
      }, 1000);
    },
    [router]
  );

  return (
    <>
      {/* Page content with entrance animation */}
      <div
        className={
          phase === "enter"
            ? "detail-page-enter"
            : phase === "closing"
              ? "detail-page-exit"
              : ""
        }
        onAnimationEnd={phase === "enter" ? handleEntryEnd : undefined}
        onClick={handleBackClick}
      >
        {children}
      </div>

      {/* Book closing overlay (only during closing phase) */}
      {phase === "closing" && (
        <div className="book-overlay book-overlay-closing" aria-hidden="true">
          <div className="book-glow book-glow-closing" />

          <div className="book-scene">
            <div className="book-body">
              {/* Back page */}
              <div className="book-back-page">
                <div className="book-inner-page book-inner-left">
                  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="book-page-symbol">
                    <polygon points="50,10 59,38 90,38 65,56 74,84 50,68 26,84 35,56 10,38 41,38" stroke="currentColor" strokeWidth="1" opacity="0.4" fill="currentColor" fillOpacity="0.05" />
                    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                  </svg>
                </div>
                <div className="book-inner-page book-inner-right">
                  <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="book-page-symbol">
                    <path d="M60 20C45 20 33 32 33 47s12 27 27 27c4 0 8-1 11-2.5C65 68 60 60 60 50S65 32 71 28c-3-5-7-8-11-8z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="75" cy="22" r="1.5" fill="currentColor" opacity="0.3" />
                  </svg>
                </div>
              </div>

              {/* Cover — closing (flips from open back to closed) */}
              <div className="book-cover book-cover-closing">
                <div className="book-cover-front">
                  <div className="book-cover-design">
                    <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="book-cover-svg">
                      <rect x="12" y="12" width="176" height="256" rx="3" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
                      <rect x="20" y="20" width="160" height="240" rx="2" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
                      <circle cx="100" cy="110" r="50" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
                      <polygon points="100,62 112,95 147,95 118,116 130,149 100,128 70,149 82,116 53,95 88,95" stroke="currentColor" strokeWidth="0.8" opacity="0.35" fill="currentColor" fillOpacity="0.04" />
                      <line x1="50" y1="185" x2="150" y2="185" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                      <line x1="60" y1="195" x2="140" y2="195" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
                      <path d="M20 20 L36 20 M20 20 L20 36" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
                      <path d="M180 20 L164 20 M180 20 L180 36" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
                      <path d="M20 260 L36 260 M20 260 L20 244" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
                      <path d="M180 260 L164 260 M180 260 L180 244" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
                    </svg>
                  </div>
                </div>
                <div className="book-cover-back">
                  <div className="book-inner-page book-inner-left">
                    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="book-page-symbol">
                      <polygon points="50,10 59,38 90,38 65,56 74,84 50,68 26,84 35,56 10,38 41,38" stroke="currentColor" strokeWidth="1" opacity="0.4" fill="currentColor" fillOpacity="0.05" />
                      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="book-spine-line" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
