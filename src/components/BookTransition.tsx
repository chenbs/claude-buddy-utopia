"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* ─── Context ──────────────────────────────────────── */
interface BookTransitionContextType {
  openBook: (href: string) => void;
  closeBook: (href: string) => void;
  /** true while the overlay is fully opaque — detail page should wait */
  isOverlayVisible: boolean;
}

const BookTransitionContext = createContext<BookTransitionContextType>({
  openBook: () => {},
  closeBook: () => {},
  isOverlayVisible: false,
});

export function useBookTransition() {
  return useContext(BookTransitionContext);
}

/* ─── Phase machine ────────────────────────────────── */
type Phase =
  | "idle"
  // Opening
  | "open-book"    // book appears (0.5s)
  | "open-flip"    // cover flips (1.0s)
  | "open-flash"   // golden flash fills screen (0.5s) then navigate
  | "open-hold"    // hold golden overlay while new page loads (0.5s)
  | "open-fade"    // fade overlay out (0.5s)
  // Closing
  | "close-fade"   // page fades out (0.35s)
  | "close-flash"  // golden flash appears (0.3s)
  | "close-book"   // book with cover closing (0.8s)
  | "close-shrink" // book shrinks away (0.4s) then navigate
  | "close-done";  // hold overlay briefly, then idle (0.3s)

export function BookTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [targetHref, setTargetHref] = useState("");
  const router = useRouter();

  const openBook = useCallback((href: string) => {
    setTargetHref(href);
    setPhase("open-book");
  }, []);

  const closeBook = useCallback((href: string) => {
    setTargetHref(href);
    setPhase("close-fade");
  }, []);

  // Phase transitions
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    switch (phase) {
      // ── Opening ──
      case "open-book":
        t = setTimeout(() => setPhase("open-flip"), 500);
        break;
      case "open-flip":
        t = setTimeout(() => setPhase("open-flash"), 950);
        break;
      case "open-flash":
        t = setTimeout(() => {
          router.push(targetHref);
          setPhase("open-hold");
        }, 550);
        break;
      case "open-hold":
        t = setTimeout(() => setPhase("open-fade"), 400);
        break;
      case "open-fade":
        t = setTimeout(() => setPhase("idle"), 500);
        break;
      // ── Closing ──
      case "close-fade":
        t = setTimeout(() => setPhase("close-flash"), 350);
        break;
      case "close-flash":
        t = setTimeout(() => setPhase("close-book"), 300);
        break;
      case "close-book":
        t = setTimeout(() => setPhase("close-shrink"), 800);
        break;
      case "close-shrink":
        t = setTimeout(() => {
          router.push(targetHref);
          setPhase("close-done");
        }, 500);
        break;
      case "close-done":
        t = setTimeout(() => setPhase("idle"), 300);
        break;
    }
    return () => clearTimeout(t);
  }, [phase, targetHref, router]);

  const isOverlayVisible = phase !== "idle";
  const isOpening = phase.startsWith("open-");
  const isClosing = phase.startsWith("close-");

  const ctx = useMemo(
    () => ({ openBook, closeBook, isOverlayVisible }),
    [openBook, closeBook, isOverlayVisible]
  );

  return (
    <BookTransitionContext.Provider value={ctx}>
      {children}

      {isOverlayVisible && (
        <div className="book-overlay" aria-hidden="true">
          {/* Dark backdrop */}
          <div className={`book-backdrop ${
            phase === "open-fade" || phase === "close-done" ? "book-backdrop-out" : ""
          }`} />

          {/* Ambient glow */}
          <div className={`book-glow ${isClosing ? "book-glow-closing" : ""}`} />

          {/* Book (visible during book/flip/flash phases) */}
          {(phase === "open-book" || phase === "open-flip" || phase === "open-flash" ||
            phase === "close-flash" || phase === "close-book" || phase === "close-shrink") && (
            <div className={`book-scene ${
              phase === "open-book" ? "book-scene-enter" : ""
            }${
              phase === "close-shrink" ? " book-scene-exit" : ""
            }`}>
              <div className="book-body">
                {/* Inner pages */}
                <div className="book-back-page">
                  <div className="book-inner-page book-inner-left">
                    <PageSymbolStar visible={
                      phase === "open-flip" || phase === "open-flash" ||
                      phase === "close-flash" || phase === "close-book"
                    } />
                  </div>
                  <div className="book-inner-page book-inner-right">
                    <PageSymbolMoon visible={
                      phase === "open-flip" || phase === "open-flash" ||
                      phase === "close-flash" || phase === "close-book"
                    } />
                  </div>
                </div>

                {/* Cover */}
                <div className={`book-cover ${
                  phase === "open-flip" || phase === "open-flash" ? "book-cover-flipping" : ""
                }${
                  phase === "close-flash" || phase === "close-book" ? " book-cover-open" : ""
                }${
                  phase === "close-book" ? " book-cover-closing-anim" : ""
                }`}>
                  <div className="book-cover-front">
                    <CoverDesign />
                  </div>
                  <div className="book-cover-back" />
                </div>

                {/* Spine */}
                <div className={`book-spine-line ${
                  phase === "open-flip" ? "book-spine-active" : ""
                }`} />
              </div>
            </div>
          )}

          {/* Golden flash — opening */}
          {(phase === "open-flash" || phase === "open-hold") && (
            <div className={`book-golden-flash ${
              phase === "open-hold" ? "book-golden-flash-hold" : ""
            }`} />
          )}

          {/* Golden overlay — fading out to reveal detail page */}
          {phase === "open-fade" && (
            <div className="book-golden-fadeout" />
          )}

          {/* Close: page fading → golden flash in */}
          {phase === "close-fade" && (
            <div className="book-close-fade-in" />
          )}

          {/* Close: golden unflash (fading away to show book) */}
          {phase === "close-flash" && (
            <div className="book-golden-unflash" />
          )}

          {/* Particles */}
          {(phase === "open-flip" || phase === "open-flash") && (
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

/* ─── SVG Components ───────────────────────────────── */
function CoverDesign() {
  return (
    <div className="book-cover-design">
      <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="book-cover-svg">
        <rect x="10" y="10" width="180" height="260" rx="3" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <rect x="18" y="18" width="164" height="244" rx="2" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
        <circle cx="100" cy="115" r="52" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
        <circle cx="100" cy="115" r="44" stroke="currentColor" strokeWidth="0.5" opacity="0.2" strokeDasharray="3 4" />
        <polygon points="100,65 111,97 145,97 117,117 128,149 100,130 72,149 83,117 55,97 89,97"
          stroke="currentColor" strokeWidth="0.8" opacity="0.4" fill="currentColor" fillOpacity="0.05" />
        <line x1="40" y1="188" x2="160" y2="188" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
        <line x1="55" y1="198" x2="145" y2="198" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
        <line x1="70" y1="208" x2="130" y2="208" stroke="currentColor" strokeWidth="0.4" opacity="0.12" />
        <path d="M18 18 L38 18 M18 18 L18 38" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M182 18 L162 18 M182 18 L182 38" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M18 262 L38 262 M18 262 L18 242" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M182 262 L162 262 M182 262 L182 242" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <polygon points="30,30 34,26 38,30 34,34" fill="currentColor" opacity="0.2" />
        <polygon points="170,30 174,26 178,30 174,34" fill="currentColor" opacity="0.2" />
        <polygon points="30,250 34,246 38,250 34,254" fill="currentColor" opacity="0.2" />
        <polygon points="170,250 174,246 178,250 174,254" fill="currentColor" opacity="0.2" />
      </svg>
    </div>
  );
}

function PageSymbolStar({ visible }: { visible: boolean }) {
  return (
    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={`book-page-symbol ${visible ? "book-page-symbol-visible" : ""}`}>
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

function PageSymbolMoon({ visible }: { visible: boolean }) {
  return (
    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={`book-page-symbol ${visible ? "book-page-symbol-visible" : ""}`}>
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

/* ─── Card link (for gallery) ──────────────────────── */
export function BookCardLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { openBook } = useBookTransition();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      openBook(href);
    },
    [href, openBook]
  );

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

/* ─── Back link (for detail page) ──────────────────── */
export function BookBackLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { closeBook } = useBookTransition();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      closeBook("/");
    },
    [closeBook]
  );

  return (
    <a href="/" onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
