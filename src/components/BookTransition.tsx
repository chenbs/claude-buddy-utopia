"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

interface BookTransitionProps {
  children: React.ReactNode;
}

export function BookTransitionProvider({ children }: BookTransitionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const navigate = useCallback(
    (href: string) => {
      setIsOpen(true);
      // Wait for the book-open animation to reach midpoint, then navigate
      setTimeout(() => {
        startTransition(() => {
          router.push(href);
        });
      }, 900);
    },
    [router, startTransition]
  );

  return (
    <BookTransitionContext.Provider value={{ navigate }}>
      {children}

      {/* Full-screen book opening overlay */}
      {isOpen && (
        <div className="book-overlay" aria-hidden="true">
          {/* Magical glow behind the book */}
          <div className="book-glow" />

          {/* The book container with 3D perspective */}
          <div className="book-container">
            {/* Left page (flips from center to left) */}
            <div className="book-page book-page-left">
              <div className="book-page-inner book-page-front">
                {/* Decorative content on left page */}
                <div className="book-page-ornament">
                  <svg
                    viewBox="0 0 100 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="book-page-symbol"
                  >
                    {/* Star pentagram */}
                    <polygon
                      points="50,10 59,38 90,38 65,56 74,84 50,68 26,84 35,56 10,38 41,38"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.4"
                      fill="currentColor"
                      fillOpacity="0.05"
                    />
                    {/* Circle around star */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                    {/* Text lines below */}
                    <line x1="20" y1="105" x2="80" y2="105" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                    <line x1="25" y1="112" x2="75" y2="112" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
                    <line x1="30" y1="119" x2="70" y2="119" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right page (flips from center to right) */}
            <div className="book-page book-page-right">
              <div className="book-page-inner book-page-front">
                {/* Decorative content on right page */}
                <div className="book-page-ornament">
                  <svg
                    viewBox="0 0 100 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="book-page-symbol"
                  >
                    {/* Moon */}
                    <path
                      d="M60 20C45 20 33 32 33 47s12 27 27 27c4 0 8-1 11-2.5C65 68 60 60 60 50S65 32 71 28c-3-5-7-8-11-8z"
                      fill="currentColor"
                      opacity="0.15"
                      stroke="currentColor"
                      strokeWidth="0.5"
                    />
                    {/* Sparkles */}
                    <circle cx="75" cy="22" r="1.5" fill="currentColor" opacity="0.3" />
                    <circle cx="80" cy="30" r="1" fill="currentColor" opacity="0.2" />
                    <circle cx="30" cy="65" r="1.2" fill="currentColor" opacity="0.25" />
                    {/* Text lines */}
                    <line x1="20" y1="95" x2="80" y2="95" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                    <line x1="25" y1="102" x2="75" y2="102" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
                    <line x1="20" y1="109" x2="80" y2="109" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                    <line x1="30" y1="116" x2="70" y2="116" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Book spine glow */}
            <div className="book-spine" />
          </div>

          {/* Floating particles during transition */}
          <div className="book-particles">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="book-particle"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 0.6}s`,
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

// Context for child components to trigger the transition
import { createContext, useContext } from "react";

interface BookTransitionContextType {
  navigate: (href: string) => void;
}

const BookTransitionContext = createContext<BookTransitionContextType>({
  navigate: () => {},
});

export function useBookTransition() {
  return useContext(BookTransitionContext);
}

// Card wrapper that intercepts clicks
interface BookCardLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function BookCardLink({ href, className, children }: BookCardLinkProps) {
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
