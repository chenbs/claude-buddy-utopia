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

/* ─── SVG feet component ──────────────────── */
function BuddyFeet({ isWalking, direction }: { isWalking: boolean; direction: 1 | -1 }) {
  return (
    <div
      className="flex justify-center gap-1 mt-0.5"
      style={{ transform: direction === -1 ? "scaleX(-1)" : undefined }}
    >
      {/* Left foot */}
      <svg
        width="10" height="8" viewBox="0 0 10 8"
        className={isWalking ? "walking-foot-left" : ""}
      >
        <ellipse cx="5" cy="5" rx="4" ry="2.5" fill="var(--accent)" opacity="0.7" />
        <circle cx="2.5" cy="3" r="1" fill="var(--accent)" opacity="0.5" />
        <circle cx="4.5" cy="2.5" r="1" fill="var(--accent)" opacity="0.5" />
        <circle cx="6.5" cy="3" r="1" fill="var(--accent)" opacity="0.5" />
      </svg>
      {/* Right foot */}
      <svg
        width="10" height="8" viewBox="0 0 10 8"
        className={isWalking ? "walking-foot-right" : ""}
      >
        <ellipse cx="5" cy="5" rx="4" ry="2.5" fill="var(--accent)" opacity="0.7" />
        <circle cx="3.5" cy="3" r="1" fill="var(--accent)" opacity="0.5" />
        <circle cx="5.5" cy="2.5" r="1" fill="var(--accent)" opacity="0.5" />
        <circle cx="7.5" cy="3" r="1" fill="var(--accent)" opacity="0.5" />
      </svg>
    </div>
  );
}

/* ─── Single walking buddy ────────────────── */
function WalkingBuddy({ id, name, author, textContent, index }: WalkingBuddyProps) {
  const buddyRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const [isWalking, setIsWalking] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const animFrameRef = useRef<number>(null);
  const stateRef = useRef<"walking" | "paused">("walking");
  const [isHovered, setIsHovered] = useState(false);
  const initDone = useRef(false);

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
    pickNewTarget();
    startAnimation();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickNewTarget = useCallback(() => {
    const margin = 40;
    const maxX = Math.max(window.innerWidth - 250, margin);
    const maxY = Math.max(window.innerHeight - 200, margin);

    targetRef.current = {
      x: margin + Math.random() * (maxX - margin),
      y: 200 + Math.random() * Math.max(maxY - 200, 100),
    };
  }, []);

  const startAnimation = useCallback(() => {
    const speed = 0.3 + Math.random() * 0.4; // px per frame, playfully slow

    const tick = () => {
      if (stateRef.current === "paused") {
        animFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      const pos = posRef.current;
      const target = targetRef.current;
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 5) {
        // Reached target: pause, then pick new target
        stateRef.current = "paused";
        setIsWalking(false);
        const pauseTime = 2000 + Math.random() * 4000;
        pauseTimerRef.current = setTimeout(() => {
          pickNewTarget();
          stateRef.current = "walking";
          setIsWalking(true);
        }, pauseTime);
      } else {
        // Move toward target with gentle smoothing
        const nx = dx / dist;
        const ny = dy / dist;
        velocityRef.current.x += (nx * speed - velocityRef.current.x) * 0.05;
        velocityRef.current.y += (ny * speed - velocityRef.current.y) * 0.05;

        pos.x += velocityRef.current.x;
        pos.y += velocityRef.current.y;

        // Update direction based on horizontal movement
        if (Math.abs(velocityRef.current.x) > 0.02) {
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
  }, [pickNewTarget]);

  // Slight bobbing when walking
  const bobbingClass = isWalking && !isHovered ? "walking-bobbing" : "";

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

          {/* Cute feet */}
          <BuddyFeet isWalking={isWalking} direction={direction} />
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
