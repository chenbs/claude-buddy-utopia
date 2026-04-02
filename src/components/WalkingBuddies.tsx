"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { BookCardLink } from "./BookTransition";

interface WalkingBuddyProps {
  id: string;
  name: string;
  author: string;
  textContent: string;
  index: number;
  isSpecial?: boolean;
}

/* ─── Leg style types ──────────────────── */
type LegStyle = "round" | "thin" | "thick" | "boot" | "claw";

const LEG_STYLES: LegStyle[] = ["round", "thin", "thick", "boot", "claw"];

function pickLegStyle(id: string): LegStyle {
  // Deterministic from id so same buddy always gets same legs
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return LEG_STYLES[Math.abs(hash) % LEG_STYLES.length];
}

/* ─── Individual leg+foot SVG renderers ── */
function LegSvg({ style }: { style: LegStyle }) {
  switch (style) {
    case "thin":
      return (
        <svg width="3" height="20" viewBox="0 0 3 20" className="buddy-leg-line">
          <line x1="1.5" y1="0" x2="1.5" y2="20" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case "thick":
      return (
        <svg width="6" height="20" viewBox="0 0 6 20" className="buddy-leg-line">
          <line x1="3" y1="0" x2="3" y2="20" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
        </svg>
      );
    case "boot":
      return (
        <svg width="5" height="20" viewBox="0 0 5 20" className="buddy-leg-line">
          <line x1="2.5" y1="0" x2="2.5" y2="20" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case "claw":
      return (
        <svg width="4" height="18" viewBox="0 0 4 18" className="buddy-leg-line">
          <line x1="2" y1="0" x2="2" y2="18" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    default: // round
      return (
        <svg width="4" height="20" viewBox="0 0 4 20" className="buddy-leg-line">
          <line x1="2" y1="0" x2="2" y2="20" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
  }
}

function FootSvg({ style }: { style: LegStyle }) {
  switch (style) {
    case "thin":
      // Small dainty paws
      return (
        <svg width="14" height="8" viewBox="0 0 14 8" className="buddy-foot">
          <ellipse cx="7" cy="5" rx="6" ry="3" fill="var(--accent)" opacity="0.7" />
          <circle cx="3.5" cy="3.5" r="1.2" fill="var(--accent)" opacity="0.5" />
          <circle cx="7" cy="2.8" r="1.2" fill="var(--accent)" opacity="0.5" />
          <circle cx="10.5" cy="3.5" r="1.2" fill="var(--accent)" opacity="0.5" />
        </svg>
      );
    case "thick":
      // Big round stompy feet
      return (
        <svg width="22" height="12" viewBox="0 0 22 12" className="buddy-foot">
          <ellipse cx="11" cy="7" rx="10" ry="5" fill="var(--accent)" opacity="0.7" />
          <circle cx="5" cy="4" r="2" fill="var(--accent)" opacity="0.5" />
          <circle cx="11" cy="3" r="2" fill="var(--accent)" opacity="0.5" />
          <circle cx="17" cy="4" r="2" fill="var(--accent)" opacity="0.5" />
        </svg>
      );
    case "boot":
      // Boot-shaped feet
      return (
        <svg width="20" height="12" viewBox="0 0 20 12" className="buddy-foot">
          <path d="M3 0 L3 7 Q3 11 7 11 L18 11 Q20 11 20 9 L20 7 Q20 5 17 5 L7 5 L7 0" fill="var(--accent)" opacity="0.65" />
        </svg>
      );
    case "claw":
      // Bird-like claws
      return (
        <svg width="18" height="12" viewBox="0 0 18 12" className="buddy-foot">
          <line x1="9" y1="0" x2="3" y2="11" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
          <line x1="9" y1="0" x2="9" y2="11" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
          <line x1="9" y1="0" x2="15" y2="11" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
          <circle cx="3" cy="11" r="1.2" fill="var(--accent)" opacity="0.5" />
          <circle cx="9" cy="11" r="1.2" fill="var(--accent)" opacity="0.5" />
          <circle cx="15" cy="11" r="1.2" fill="var(--accent)" opacity="0.5" />
        </svg>
      );
    default: // round (original)
      return (
        <svg width="18" height="10" viewBox="0 0 18 10" className="buddy-foot">
          <ellipse cx="9" cy="6" rx="8" ry="4" fill="var(--accent)" opacity="0.75" />
          <circle cx="4" cy="4" r="1.5" fill="var(--accent)" opacity="0.55" />
          <circle cx="7.5" cy="3" r="1.5" fill="var(--accent)" opacity="0.55" />
          <circle cx="11" cy="3" r="1.5" fill="var(--accent)" opacity="0.55" />
          <circle cx="14" cy="4" r="1.5" fill="var(--accent)" opacity="0.55" />
        </svg>
      );
  }
}

/* ─── Legs + Feet component ──────────────────── */
function BuddyLegs({ isWalking, direction, action, legStyle }: {
  isWalking: boolean;
  direction: 1 | -1;
  action: BuddyAction;
  legStyle: LegStyle;
}) {
  const isJumping = action === "jump" || action === "hop";

  return (
    <div
      className="flex justify-center gap-3 relative"
      style={{ transform: direction === -1 ? "scaleX(-1)" : undefined, height: 34 }}
    >
      {/* Left leg + foot */}
      <div className={`buddy-leg ${isWalking && !isJumping ? "buddy-leg-left" : ""} ${isJumping ? "buddy-leg-tuck" : ""}`}>
        <LegSvg style={legStyle} />
        <FootSvg style={legStyle} />
      </div>

      {/* Right leg + foot */}
      <div className={`buddy-leg ${isWalking && !isJumping ? "buddy-leg-right" : ""} ${isJumping ? "buddy-leg-tuck" : ""}`}>
        <LegSvg style={legStyle} />
        <FootSvg style={legStyle} />
      </div>
    </div>
  );
}

/* ─── Action types ────────────────── */
type BuddyAction = "walk" | "dash" | "jump" | "hop" | "spin" | "wiggle" | "idle";

/* ─── Single walking buddy ────────────────── */
function WalkingBuddy({ id, name, author, textContent, index, isSpecial }: WalkingBuddyProps) {
  const buddyRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const speedRef = useRef(0.8);
  const [isWalking, setIsWalking] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [action, setAction] = useState<BuddyAction>("walk");
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const animFrameRef = useRef<number>(null);
  const stateRef = useRef<"walking" | "paused" | "action">("walking");
  const actionRef = useRef<BuddyAction>("walk");
  const [isHovered, setIsHovered] = useState(false);
  const initDone = useRef(false);
  const frameCountRef = useRef(0);
  const nextSurpriseRef = useRef(120 + Math.random() * 300);
  const nextRetargetRef = useRef(60 + Math.random() * 120);

  const legStyle = useMemo(() => pickLegStyle(id), [id]);

  // Speed multiplier: 30% faster than before
  const speedMul = 1.3;

  const getPageHeight = useCallback(() => {
    return Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      window.innerHeight
    );
  }, []);

  const pickNewTarget = useCallback(() => {
    const margin = 60;
    const maxX = Math.max(window.innerWidth - 280, margin);
    const pageH = getPageHeight();

    targetRef.current = {
      x: margin + Math.random() * (maxX - margin),
      y: 120 + Math.random() * Math.max(pageH - 250, 200),
    };
    // Schedule next mid-walk retarget
    nextRetargetRef.current = frameCountRef.current + 80 + Math.random() * 200;
  }, [getPageHeight]);

  // Trigger a surprise action
  const doSurpriseAction = useCallback(() => {
    const actions: BuddyAction[] = ["dash", "jump", "hop", "spin", "wiggle"];
    const picked = actions[Math.floor(Math.random() * actions.length)];
    actionRef.current = picked;
    setAction(picked);

    const el = innerRef.current;

    switch (picked) {
      case "dash":
        speedRef.current = (3 + Math.random() * 3) * speedMul;
        setTimeout(() => {
          speedRef.current = (0.6 + Math.random() * 0.8) * speedMul;
          actionRef.current = "walk";
          setAction("walk");
        }, 1000 + Math.random() * 1000);
        break;

      case "jump":
        if (el) {
          el.style.transition = "transform 0.3s cubic-bezier(0.2, 0, 0.3, 1)";
          el.style.transform = "translateY(-35px)";
          setTimeout(() => {
            el.style.transition = "transform 0.25s cubic-bezier(0.6, 0, 1, 1)";
            el.style.transform = "translateY(0)";
          }, 300);
          setTimeout(() => {
            el.style.transition = "";
            el.style.transform = "";
            actionRef.current = "walk";
            setAction("walk");
          }, 550);
        }
        break;

      case "hop":
        if (el) {
          let hopCount = 0;
          const maxHops = 3 + Math.floor(Math.random() * 3);
          const doHop = () => {
            if (hopCount >= maxHops) {
              el.style.transition = "";
              el.style.transform = "";
              actionRef.current = "walk";
              setAction("walk");
              return;
            }
            el.style.transition = "transform 0.15s cubic-bezier(0.2, 0, 0.3, 1)";
            el.style.transform = "translateY(-15px)";
            setTimeout(() => {
              el.style.transition = "transform 0.15s cubic-bezier(0.6, 0, 1, 1)";
              el.style.transform = "translateY(0)";
              hopCount++;
              setTimeout(doHop, 150);
            }, 150);
          };
          doHop();
          speedRef.current = 2 * speedMul;
          setTimeout(() => {
            speedRef.current = (0.6 + Math.random() * 0.8) * speedMul;
          }, maxHops * 300);
        }
        break;

      case "spin":
        if (el) {
          el.style.transition = "transform 0.6s cubic-bezier(0.3, 0, 0.2, 1)";
          el.style.transform = "rotate(360deg)";
          setTimeout(() => {
            el.style.transition = "none";
            el.style.transform = "";
            requestAnimationFrame(() => {
              el.style.transition = "";
              actionRef.current = "walk";
              setAction("walk");
            });
          }, 620);
        }
        break;

      case "wiggle":
        if (el) {
          el.style.transition = "transform 0.1s ease-in-out";
          let wiggleCount = 0;
          const maxWiggles = 6;
          const doWiggle = () => {
            if (wiggleCount >= maxWiggles) {
              el.style.transform = "";
              el.style.transition = "";
              actionRef.current = "walk";
              setAction("walk");
              return;
            }
            const angle = wiggleCount % 2 === 0 ? 8 : -8;
            el.style.transform = `rotate(${angle}deg)`;
            wiggleCount++;
            setTimeout(doWiggle, 100);
          };
          doWiggle();
        }
        break;
    }

    nextSurpriseRef.current = frameCountRef.current + 200 + Math.random() * 500;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    const margin = 60;
    const maxX = Math.max(window.innerWidth - 280, margin);
    const pageH = getPageHeight();

    const startX = margin + Math.random() * (maxX - margin);
    const startY = 120 + Math.random() * Math.max(pageH - 250, 200);

    posRef.current = { x: startX, y: startY };
    speedRef.current = (0.6 + Math.random() * 0.8) * speedMul;

    if (buddyRef.current) {
      buddyRef.current.style.transform = `translate(${startX}px, ${startY}px)`;
    }

    pickNewTarget();
    startAnimation();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startAnimation = useCallback(() => {
    const tick = () => {
      frameCountRef.current++;

      if (stateRef.current === "paused") {
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      const pos = posRef.current;
      const target = targetRef.current;
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (
        frameCountRef.current > nextSurpriseRef.current &&
        actionRef.current === "walk" &&
        stateRef.current === "walking"
      ) {
        doSurpriseAction();
      }

      if (
        frameCountRef.current > nextRetargetRef.current &&
        actionRef.current === "walk" &&
        stateRef.current === "walking" &&
        dist > 30
      ) {
        pickNewTarget();
      }

      if (dist < 8) {
        stateRef.current = "paused";
        setIsWalking(false);
        setAction("idle");
        actionRef.current = "idle";
        const pauseTime = Math.random() < 0.3
          ? 300 + Math.random() * 800
          : 1500 + Math.random() * 3500;
        pauseTimerRef.current = setTimeout(() => {
          pickNewTarget();
          speedRef.current = (0.6 + Math.random() * 0.8) * speedMul;
          if (Math.random() < 0.25) {
            speedRef.current = (2.5 + Math.random() * 2) * speedMul;
            setTimeout(() => {
              speedRef.current = (0.6 + Math.random() * 0.8) * speedMul;
            }, 800 + Math.random() * 600);
          }
          stateRef.current = "walking";
          actionRef.current = "walk";
          setAction("walk");
          setIsWalking(true);
        }, pauseTime);
      } else {
        const speed = speedRef.current;
        const nx = dx / dist;
        const ny = dy / dist;

        const smoothing = speed > 2 ? 0.12 : 0.08;
        velocityRef.current.x += (nx * speed - velocityRef.current.x) * smoothing;
        velocityRef.current.y += (ny * speed - velocityRef.current.y) * smoothing;

        pos.x += velocityRef.current.x;
        pos.y += velocityRef.current.y;

        pos.x = Math.max(10, Math.min(window.innerWidth - 60, pos.x));
        pos.y = Math.max(80, Math.min(getPageHeight() - 60, pos.y));

        if (Math.abs(velocityRef.current.x) > 0.05) {
          setDirection(velocityRef.current.x > 0 ? 1 : -1);
        }
      }

      if (buddyRef.current) {
        buddyRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, [pickNewTarget, doSurpriseAction, speedMul, getPageHeight]);

  const speedClass = speedRef.current > 2 ? "walking-fast" : "walking-normal";
  const bobbingClass = isWalking && !isHovered && action === "walk" ? `walking-bobbing ${speedClass}` : "";
  const buddyScale = isSpecial ? 1.0 : 0.8;
  const specialClass = isSpecial ? "walking-buddy-special" : "";
  const hoveredClass = isHovered ? "walking-buddy-hovered" : "";

  return (
    <div
      ref={buddyRef}
      className="walking-buddy-container"
      style={{ position: "absolute", left: 0, top: 0, zIndex: isSpecial ? 25 : 20 }}
    >
      <BookCardLink
        href={`/buddy/${id}`}
        className="block cursor-pointer"
      >
        <div
          ref={innerRef}
          className={`walking-buddy group ${bobbingClass} ${specialClass} ${hoveredClass}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ transform: `scale(${buddyScale})` }}
        >
          {/* Name label on hover */}
          <div className="walking-buddy-label">
            <span className="text-highlight text-[8px]">&#x2726;</span>
            <span className="font-display text-[10px] tracking-wider uppercase text-accent">
              {name}
            </span>
            <span className="text-highlight text-[8px]">&#x2726;</span>
          </div>

          {/* Special crown for dangerous buddies */}
          {isSpecial && (
            <div className="walking-buddy-crown">
              <svg width="34" height="19" viewBox="0 0 28 16">
                <path d="M2 14 L5 4 L9 10 L14 2 L19 10 L23 4 L26 14 Z" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.8" />
                <circle cx="5" cy="3" r="1.5" fill="var(--accent)" opacity="0.7" />
                <circle cx="14" cy="1" r="1.5" fill="var(--accent)" opacity="0.7" />
                <circle cx="23" cy="3" r="1.5" fill="var(--accent)" opacity="0.7" />
              </svg>
            </div>
          )}

          {/* ASCII body */}
          <div className="walking-buddy-body-wrap">
            <pre className={`walking-buddy-body font-mono text-[10px] sm:text-xs leading-tight whitespace-pre select-none ${isSpecial ? "walking-buddy-body-special" : ""}`}>
              {textContent}
            </pre>
          </div>

          {/* Legs + Feet */}
          <BuddyLegs isWalking={isWalking} direction={direction} action={action} legStyle={legStyle} />
        </div>
      </BookCardLink>
    </div>
  );
}

const DANGEROUS_STRING = "claude --dangerously-skip-permissions";

/* ─── Container for all walking buddies ───── */
export function WalkingBuddies({
  buddies,
}: {
  buddies: Array<{
    id: string;
    name: string;
    author: string;
    text_content: string;
  }>;
}) {
  if (buddies.length === 0) return null;

  return (
    <div className="walking-buddies-field" aria-label="Walking text buddies">
      {buddies.map((buddy, index) => (
        <WalkingBuddy
          key={buddy.id}
          id={buddy.id}
          name={buddy.name}
          author={buddy.author}
          textContent={buddy.text_content}
          index={index}
          isSpecial={buddy.text_content.includes(DANGEROUS_STRING)}
        />
      ))}
    </div>
  );
}
