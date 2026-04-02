"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { BookCardLink } from "./BookTransition";

interface WalkingBuddyProps {
  id: string;
  name: string;
  author: string;
  textContent: string;
  index: number;
}

/* ─── Legs + Feet SVG component ──────────────────── */
function BuddyLegs({ isWalking, direction, action }: {
  isWalking: boolean;
  direction: 1 | -1;
  action: BuddyAction;
}) {
  const isJumping = action === "jump" || action === "hop";

  return (
    <div
      className="flex justify-center gap-3 relative"
      style={{ transform: direction === -1 ? "scaleX(-1)" : undefined, height: 28 }}
    >
      {/* Left leg + foot */}
      <div className={`buddy-leg ${isWalking && !isJumping ? "buddy-leg-left" : ""} ${isJumping ? "buddy-leg-tuck" : ""}`}>
        {/* Leg */}
        <svg width="4" height="12" viewBox="0 0 4 12" className="buddy-leg-line">
          <line x1="2" y1="0" x2="2" y2="12" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        </svg>
        {/* Foot */}
        <svg width="18" height="10" viewBox="0 0 18 10" className="buddy-foot">
          <ellipse cx="9" cy="6" rx="8" ry="4" fill="var(--accent)" opacity="0.75" />
          <circle cx="4" cy="4" r="1.5" fill="var(--accent)" opacity="0.55" />
          <circle cx="7.5" cy="3" r="1.5" fill="var(--accent)" opacity="0.55" />
          <circle cx="11" cy="3" r="1.5" fill="var(--accent)" opacity="0.55" />
          <circle cx="14" cy="4" r="1.5" fill="var(--accent)" opacity="0.55" />
        </svg>
      </div>

      {/* Right leg + foot */}
      <div className={`buddy-leg ${isWalking && !isJumping ? "buddy-leg-right" : ""} ${isJumping ? "buddy-leg-tuck" : ""}`}>
        {/* Leg */}
        <svg width="4" height="12" viewBox="0 0 4 12" className="buddy-leg-line">
          <line x1="2" y1="0" x2="2" y2="12" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        </svg>
        {/* Foot */}
        <svg width="18" height="10" viewBox="0 0 18 10" className="buddy-foot">
          <ellipse cx="9" cy="6" rx="8" ry="4" fill="var(--accent)" opacity="0.75" />
          <circle cx="4" cy="4" r="1.5" fill="var(--accent)" opacity="0.55" />
          <circle cx="7.5" cy="3" r="1.5" fill="var(--accent)" opacity="0.55" />
          <circle cx="11" cy="3" r="1.5" fill="var(--accent)" opacity="0.55" />
          <circle cx="14" cy="4" r="1.5" fill="var(--accent)" opacity="0.55" />
        </svg>
      </div>
    </div>
  );
}

/* ─── Action types ────────────────── */
type BuddyAction = "walk" | "dash" | "jump" | "hop" | "spin" | "wiggle" | "idle";

/* ─── Single walking buddy ────────────────── */
function WalkingBuddy({ id, name, author, textContent, index }: WalkingBuddyProps) {
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

  const pickNewTarget = useCallback(() => {
    const margin = 40;
    const maxX = Math.max(window.innerWidth - 250, margin);
    const maxY = Math.max(window.innerHeight - 200, margin);

    targetRef.current = {
      x: margin + Math.random() * (maxX - margin),
      y: 200 + Math.random() * Math.max(maxY - 200, 100),
    };
  }, []);

  // Trigger a surprise action
  const doSurpriseAction = useCallback(() => {
    const actions: BuddyAction[] = ["dash", "jump", "hop", "spin", "wiggle"];
    const picked = actions[Math.floor(Math.random() * actions.length)];
    actionRef.current = picked;
    setAction(picked);

    const el = innerRef.current;

    switch (picked) {
      case "dash":
        // Sudden burst of speed for 1-2 seconds
        speedRef.current = 3 + Math.random() * 3;
        setTimeout(() => {
          speedRef.current = 0.6 + Math.random() * 0.8;
          actionRef.current = "walk";
          setAction("walk");
        }, 1000 + Math.random() * 1000);
        break;

      case "jump":
        // Big jump up and down
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
        // A series of small hops
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
          // Also boost speed during hops
          speedRef.current = 2;
          setTimeout(() => {
            speedRef.current = 0.6 + Math.random() * 0.8;
          }, maxHops * 300);
        }
        break;

      case "spin":
        // Spin around 360 degrees
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
        // Wiggle side to side
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

    // Schedule next surprise
    nextSurpriseRef.current = frameCountRef.current + 200 + Math.random() * 500;
  }, []);

  // Pick a random starting position and first target
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    const margin = 40;
    const maxX = Math.max(window.innerWidth - 250, margin);
    const maxY = Math.max(window.innerHeight - 200, margin);

    // Spread initial positions based on index
    const startX = margin + ((index * 317) % (maxX - margin));
    const startY = 200 + ((index * 523) % Math.max(maxY - 200, 100));

    posRef.current = { x: startX, y: startY };
    speedRef.current = 0.6 + Math.random() * 0.8;
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

      // Check for surprise action
      if (
        frameCountRef.current > nextSurpriseRef.current &&
        actionRef.current === "walk" &&
        stateRef.current === "walking"
      ) {
        doSurpriseAction();
      }

      if (dist < 8) {
        // Reached target: pause, then pick new target
        stateRef.current = "paused";
        setIsWalking(false);
        setAction("idle");
        actionRef.current = "idle";
        // Random pause: sometimes very short, sometimes longer
        const pauseTime = Math.random() < 0.3
          ? 300 + Math.random() * 800   // Short pause (30% chance)
          : 1500 + Math.random() * 3500; // Normal pause
        pauseTimerRef.current = setTimeout(() => {
          pickNewTarget();
          speedRef.current = 0.6 + Math.random() * 0.8;
          // Sometimes start with a dash after pausing
          if (Math.random() < 0.25) {
            speedRef.current = 2.5 + Math.random() * 2;
            setTimeout(() => {
              speedRef.current = 0.6 + Math.random() * 0.8;
            }, 800 + Math.random() * 600);
          }
          stateRef.current = "walking";
          actionRef.current = "walk";
          setAction("walk");
          setIsWalking(true);
        }, pauseTime);
      } else {
        // Move toward target with speed variations
        const speed = speedRef.current;
        const nx = dx / dist;
        const ny = dy / dist;

        // Smoothing factor: higher = more responsive turning
        const smoothing = speed > 2 ? 0.12 : 0.06;
        velocityRef.current.x += (nx * speed - velocityRef.current.x) * smoothing;
        velocityRef.current.y += (ny * speed - velocityRef.current.y) * smoothing;

        pos.x += velocityRef.current.x;
        pos.y += velocityRef.current.y;

        // Clamp to viewport
        pos.x = Math.max(10, Math.min(window.innerWidth - 60, pos.x));
        pos.y = Math.max(80, Math.min(window.innerHeight - 60, pos.y));

        // Update direction based on horizontal movement
        if (Math.abs(velocityRef.current.x) > 0.05) {
          setDirection(velocityRef.current.x > 0 ? 1 : -1);
        }
      }

      // Apply position
      if (buddyRef.current) {
        buddyRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, [pickNewTarget, doSurpriseAction]);

  // Dynamic walk speed class
  const speedClass = speedRef.current > 2 ? "walking-fast" : "walking-normal";
  const bobbingClass = isWalking && !isHovered && action === "walk" ? `walking-bobbing ${speedClass}` : "";

  return (
    <div
      ref={buddyRef}
      className="walking-buddy-container"
      style={{ position: "absolute", left: 0, top: 0, zIndex: 20 }}
    >
      <BookCardLink
        href={`/buddy/${id}`}
        className="block cursor-pointer"
      >
        <div
          ref={innerRef}
          className={`walking-buddy group ${bobbingClass}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Name label on hover */}
          <div className="walking-buddy-label">
            <span className="text-highlight text-[8px]">&#x2726;</span>
            <span className="font-display text-[10px] tracking-wider uppercase text-accent">
              {name}
            </span>
            <span className="text-highlight text-[8px]">&#x2726;</span>
          </div>

          {/* ASCII body */}
          <pre className="walking-buddy-body font-mono text-[10px] sm:text-xs leading-tight whitespace-pre text-card-text select-none">
            {textContent}
          </pre>

          {/* Legs + Feet */}
          <BuddyLegs isWalking={isWalking} direction={direction} action={action} />
        </div>
      </BookCardLink>
    </div>
  );
}

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
        />
      ))}
    </div>
  );
}
