"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
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

/* ─── Phase machine ────────────────────────────────── */
// idle → cover-appear → cover-flip → flash → navigate
type Phase = "idle" | "cover-appear" | "cover-flip" | "flash" | "done";

export function BookTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [targetHref, setTargetHref] = useState("");
  const router = useRouter();

  const navigate = useCallback(
    (href: string) => {
      setTargetHref(href);
      setPhase("cover-appear");
    },
    []
  );

  // Phase transitions driven by timers
  useEffect(() => {
    if (phase === "cover-appear") {
      // Book appears, then cover starts flipping
      const t = setTimeout(() => setPhase("cover-flip"), 500);
      return () => clearTimeout(t);
    }
    if (phase === "cover-flip") {
      // Cover flips open, then golden flash
      const t = setTimeout(() => setPhase("flash"), 1000);
      return () => clearTimeout(t);
    }
    if (phase === "flash") {
      // Flash fills screen, then navigate
      const t = setTimeout(() => {
        router.push(targetHref);
        setPhase("done");
      }, 700);
      return () => clearTimeout(t);
    }
  }, [phase, targetHref, router]);

  const isActive = phase !== "idle" && phase !== "done";

  return (
    <BookTransitionContext.Provider value={{ navigate }}>
      {children}

      {isActive && (
        <div className="book-overlay" aria-hidden="true">
          {/* Dark backdrop */}
          <div className="book-backdrop" />

          {/* Ambient glow */}
          <div className="book-glow" />

          {/* Book */}
          <div className={`book-scene ${phase === "cover-appear" ? "book-scene-enter" : ""}`}>
            <div className="book-body">
              {/* Inner pages (revealed when cover opens) */}
              <div className="book-back-page">
                <div className="book-inner-page book-inner-left">
                  <PageSymbolStar />
                </div>
                <div className="book-inner-page book-inner-right">
                  <PageSymbolMoon />
                </div>
              </div>

              {/* Cover (flips) */}
              <div className={`book-cover ${phase === "cover-flip" || phase === "flash" ? "book-cover-flipping" : ""}`}>
                <div className="book-cover-front">
                  <CoverDesign />
                </div>
                <div className="book-cover-back" />
              </div>

              {/* Spine */}
              <div className={`book-spine-line ${phase === "cover-flip" ? "book-spine-active" : ""}`} />
            </div>
          </div>

          {/* Golden flash that fills the screen */}
          {phase === "flash" && <div className="book-golden-flash" />}

          {/* Particles */}
          {(phase === "cover-flip" || phase === "flash") && (
            <div className="book-particles">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="book-particle"
                  style={{
                    left: `${5 + Math.random() * 90}%`,
                    top: `${10 + Math.random() * 80}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${0.6 + Math.random() * 0.8}s`,
                    width: `${2 + Math.random() * 3}px`,
                    height: `${2 + Math.random() * 3}px`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </BookTransitionContext.Provider>
  );
}

/* ─── Cover emblem design ──────────────────────────── */
function CoverDesign() {
  return (
    <div className="book-cover-design">
      <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="book-cover-svg">
        {/* Double frame */}
        <rect x="10" y="10" width="180" height="260" rx="3" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <rect x="18" y="18" width="164" height="244" rx="2" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
        {/* Central emblem */}
        <circle cx="100" cy="115" r="52" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
        <circle cx="100" cy="115" r="44" stroke="currentColor" strokeWidth="0.5" opacity="0.2" strokeDasharray="3 4" />
        <polygon
          points="100,65 111,97 145,97 117,117 128,149 100,130 72,149 83,117 55,97 89,97"
          stroke="currentColor" strokeWidth="0.8" opacity="0.4"
          fill="currentColor" fillOpacity="0.05"
        />
        {/* Decorative lines */}
        <line x1="40" y1="188" x2="160" y2="188" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
        <line x1="55" y1="198" x2="145" y2="198" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
        <line x1="70" y1="208" x2="130" y2="208" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
        {/* Corner ornaments */}
        <path d="M18 18 L38 18 M18 18 L18 38" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M182 18 L162 18 M182 18 L182 38" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M18 262 L38 262 M18 262 L18 242" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M182 262 L162 262 M182 262 L182 242" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        {/* Corner diamonds */}
        <polygon points="30,30 34,26 38,30 34,34" fill="currentColor" opacity="0.2" />
        <polygon points="170,30 174,26 178,30 174,34" fill="currentColor" opacity="0.2" />
        <polygon points="30,250 34,246 38,250 34,254" fill="currentColor" opacity="0.2" />
        <polygon points="170,250 174,246 178,250 174,254" fill="currentColor" opacity="0.2" />
      </svg>
    </div>
  );
}

/* ─── Page symbols ─────────────────────────────────── */
function PageSymbolStar() {
  return (
    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="book-page-symbol">
      <polygon points="50,10 59,38 90,38 65,56 74,84 50,68 26,84 35,56 10,38 41,38"
        stroke="currentColor" strokeWidth="0.8" opacity="0.5" fill="currentColor" fillOpacity="0.05" />
      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.3" opacity="0.15" strokeDasharray="2 3" />
      <line x1="20" y1="105" x2="80" y2="105" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <line x1="28" y1="113" x2="72" y2="113" stroke="currentColor" strokeWidth="0.4" opacity="0.18" />
      <line x1="35" y1="121" x2="65" y2="121" stroke="currentColor" strokeWidth="0.3" opacity="0.12" />
    </svg>
  );
}

function PageSymbolMoon() {
  return (
    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="book-page-symbol">
      <path d="M60 20C45 20 33 32 33 47s12 27 27 27c4 0 8-1 11-2.5C65 68 60 60 60 50S65 32 71 28c-3-5-7-8-11-8z"
        fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="73" cy="23" r="1.2" fill="currentColor" opacity="0.35" />
      <circle cx="78" cy="32" r="0.8" fill="currentColor" opacity="0.25" />
      <circle cx="28" cy="62" r="1" fill="currentColor" opacity="0.3" />
      <line x1="20" y1="95" x2="80" y2="95" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <line x1="28" y1="103" x2="72" y2="103" stroke="currentColor" strokeWidth="0.4" opacity="0.18" />
      <line x1="20" y1="111" x2="80" y2="111" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
      <line x1="32" y1="119" x2="68" y2="119" stroke="currentColor" strokeWidth="0.3" opacity="0.12" />
    </svg>
  );
}

/* ─── Card link ────────────────────────────────────── */
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
