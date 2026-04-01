"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useTransition,
} from "react";

/* ─── Context ──────────────────────────────────────── */
interface BookTransitionContextType {
  navigate: (href: string) => void;
}

const BookTransitionContext = createContext<BookTransitionContextType>({
  navigate: () => {},
});

export function useBookTransition() {
  return useContext(BookTransitionContext);
}

/* ─── Provider (wraps gallery) ─────────────────────── */
export function BookTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<"idle" | "opening">("idle");
  const [, startTransition] = useTransition();
  const router = useRouter();

  const navigate = useCallback(
    (href: string) => {
      setPhase("opening");
      // Let the cover flip open, then navigate
      setTimeout(() => {
        startTransition(() => {
          router.push(href);
        });
      }, 1200);
    },
    [router, startTransition]
  );

  return (
    <BookTransitionContext.Provider value={{ navigate }}>
      {children}

      {/* Overlay — only rendered while opening */}
      {phase === "opening" && (
        <div className="book-overlay" aria-hidden="true">
          <div className="book-glow" />

          {/* Book: back-page (static) + cover (flips) */}
          <div className="book-scene">
            <div className="book-body">
              {/* Back page — always visible, sits behind */}
              <div className="book-back-page">
                <BookPageContent side="left" />
                <BookPageContent side="right" />
              </div>

              {/* Cover — flips from right to left like a real book */}
              <div className="book-cover">
                {/* Front of cover (visible when closed) */}
                <div className="book-cover-front">
                  <BookCoverDesign />
                </div>
                {/* Back of cover (visible when opened, becomes left inner page) */}
                <div className="book-cover-back">
                  <BookPageContent side="left" />
                </div>
              </div>

              {/* Spine */}
              <div className="book-spine-line" />
            </div>
          </div>

          {/* Particles */}
          <div className="book-particles">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="book-particle"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${15 + Math.random() * 70}%`,
                  animationDelay: `${0.3 + Math.random() * 0.8}s`,
                  animationDuration: `${0.8 + Math.random() * 0.6}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </BookTransitionContext.Provider>
  );
}

/* ─── Cover design (closed state) ──────────────────── */
function BookCoverDesign() {
  return (
    <div className="book-cover-design">
      <svg
        viewBox="0 0 200 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="book-cover-svg"
      >
        {/* Border frame */}
        <rect
          x="12"
          y="12"
          width="176"
          height="256"
          rx="3"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.35"
        />
        <rect
          x="20"
          y="20"
          width="160"
          height="240"
          rx="2"
          stroke="currentColor"
          strokeWidth="0.4"
          opacity="0.2"
        />
        {/* Central emblem — star in circle */}
        <circle
          cx="100"
          cy="110"
          r="50"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.3"
        />
        <circle
          cx="100"
          cy="110"
          r="42"
          stroke="currentColor"
          strokeWidth="0.4"
          opacity="0.2"
          strokeDasharray="4 3"
        />
        <polygon
          points="100,62 112,95 147,95 118,116 130,149 100,128 70,149 82,116 53,95 88,95"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.35"
          fill="currentColor"
          fillOpacity="0.04"
        />
        {/* Title area */}
        <line
          x1="50"
          y1="185"
          x2="150"
          y2="185"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.2"
        />
        <line
          x1="60"
          y1="195"
          x2="140"
          y2="195"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.15"
        />
        <line
          x1="70"
          y1="205"
          x2="130"
          y2="205"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.1"
        />
        {/* Corner flourishes */}
        <path
          d="M20 20 L36 20 M20 20 L20 36"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.4"
        />
        <path
          d="M180 20 L164 20 M180 20 L180 36"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.4"
        />
        <path
          d="M20 260 L36 260 M20 260 L20 244"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.4"
        />
        <path
          d="M180 260 L164 260 M180 260 L180 244"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.4"
        />
        {/* Small sparkle dots */}
        <circle cx="40" cy="40" r="1.2" fill="currentColor" opacity="0.25" />
        <circle cx="160" cy="40" r="1" fill="currentColor" opacity="0.2" />
        <circle cx="40" cy="240" r="1" fill="currentColor" opacity="0.2" />
        <circle cx="160" cy="240" r="1.2" fill="currentColor" opacity="0.25" />
      </svg>
    </div>
  );
}

/* ─── Inner page content ───────────────────────────── */
function BookPageContent({ side }: { side: "left" | "right" }) {
  if (side === "left") {
    return (
      <div className="book-inner-page book-inner-left">
        <svg
          viewBox="0 0 100 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="book-page-symbol"
        >
          <polygon
            points="50,10 59,38 90,38 65,56 74,84 50,68 26,84 35,56 10,38 41,38"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.4"
            fill="currentColor"
            fillOpacity="0.05"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.3"
          />
          <line x1="20" y1="105" x2="80" y2="105" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          <line x1="25" y1="112" x2="75" y2="112" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
          <line x1="30" y1="119" x2="70" y2="119" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        </svg>
      </div>
    );
  }
  return (
    <div className="book-inner-page book-inner-right">
      <svg
        viewBox="0 0 100 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="book-page-symbol"
      >
        <path
          d="M60 20C45 20 33 32 33 47s12 27 27 27c4 0 8-1 11-2.5C65 68 60 60 60 50S65 32 71 28c-3-5-7-8-11-8z"
          fill="currentColor"
          opacity="0.15"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <circle cx="75" cy="22" r="1.5" fill="currentColor" opacity="0.3" />
        <circle cx="80" cy="30" r="1" fill="currentColor" opacity="0.2" />
        <circle cx="30" cy="65" r="1.2" fill="currentColor" opacity="0.25" />
        <line x1="20" y1="95" x2="80" y2="95" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <line x1="25" y1="102" x2="75" y2="102" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        <line x1="20" y1="109" x2="80" y2="109" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <line x1="30" y1="116" x2="70" y2="116" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      </svg>
    </div>
  );
}

/* ─── Card link (intercepts navigation) ─────────────── */
export function BookCardLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { navigate } = useBookTransition();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      navigate(href);
    },
    [href, navigate]
  );

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
