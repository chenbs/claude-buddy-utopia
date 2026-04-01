"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { BookTransitionProvider, BookCardLink } from "./BookTransition";

interface Buddy {
  id: string;
  name: string;
  author: string;
  image_url: string;
  description: string | null;
  created_at: string;
}

/* ─── 3D tilt card wrapper ─────────────────────────── */
function Card3D({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; // 0..width
    const y = e.clientY - rect.top; // 0..height
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    // Rotation: ±12 degrees max
    const rotateY = ((x - midX) / midX) * 12;
    const rotateX = ((midY - y) / midY) * 12;
    // Shine position
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
    el.style.setProperty("--shine-x", `${shineX}%`);
    el.style.setProperty("--shine-y", `${shineY}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.setProperty("--shine-x", "50%");
    el.style.setProperty("--shine-y", "50%");
  }, []);

  return (
    <div
      ref={cardRef}
      className="card-3d"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <BookCardLink
        href={href}
        className="buddy-card group block bg-card-bg border border-dashed border-card-border p-2 overflow-hidden"
      >
        {children}
      </BookCardLink>
      {/* Shine overlay */}
      <div className="card-3d-shine" />
    </div>
  );
}

/* ─── Gallery grid ─────────────────────────────────── */
export function BuddyGallery({ buddies }: { buddies: Buddy[] }) {
  return (
    <BookTransitionProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-12">
        {buddies.map((buddy, index) => (
          <Card3D key={buddy.id} href={`/buddy/${buddy.id}`}>
            {/* Inner card */}
            <div className="bg-card-inner overflow-hidden relative">
              {/* Ornate corners on the inner card */}
              <div className="ornate-frame ornate-corners absolute inset-0 pointer-events-none" />

              {/* Index */}
              <div className="px-3 pt-2.5 pb-1 flex justify-between items-center relative z-10">
                <span className="font-mono text-[10px] text-card-text/40">
                  ({String(index + 1).padStart(2, "0")})
                </span>
                <span className="text-highlight/40 text-[10px]">&#x2726;</span>
              </div>

              {/* Image */}
              <div className="aspect-square relative mx-3 mb-2 overflow-hidden border border-card-border/20">
                <Image
                  src={buddy.image_url}
                  alt={buddy.name}
                  fill
                  className="object-cover img-reveal"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              {/* Info */}
              <div className="px-3 pb-3 relative z-10">
                <h3 className="font-display text-sm tracking-wider uppercase text-card-text truncate group-hover:text-highlight transition-colors duration-300">
                  {buddy.name}
                </h3>
                <p className="text-card-text/50 text-xs italic mt-0.5">
                  by {buddy.author}
                </p>
              </div>
            </div>
          </Card3D>
        ))}
      </div>
    </BookTransitionProvider>
  );
}
