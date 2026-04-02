"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { BookCardLink } from "./BookTransition";

interface Buddy {
  id: string;
  name: string;
  author: string;
  image_url: string;
  text_content: string | null;
  description: string | null;
  created_at: string;
}

/* ─── 3D tilt card ─────────────────────────────────── */
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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateY = ((x - midX) / midX) * 10;
    const rotateX = ((midY - y) / midY) * 10;
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
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
      <BookCardLink href={href} className="magic-card group block">
        {children}
      </BookCardLink>
      {/* Light reflection */}
      <div className="card-3d-shine" />
    </div>
  );
}

/* ─── Gallery grid ─────────────────────────────────── */
export function BuddyGallery({ buddies }: { buddies: Buddy[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-12">
      {buddies.map((buddy, index) => (
        <Card3D key={buddy.id} href={`/buddy/${buddy.id}`}>
            {/* Golden border frame */}
            <div className="magic-card-border">
              <div className="magic-card-inner relative overflow-hidden">
                {/* Rune watermark */}
                <div className="magic-card-rune" aria-hidden="true">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
                    <polygon points="50,12 58,38 86,38 63,54 71,80 50,64 29,80 37,54 14,38 42,38"
                      stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
                  </svg>
                </div>

                {/* Corner filigree */}
                <div className="magic-card-corners" />

                {/* Index badge */}
                <div className="px-4 pt-3 pb-1 flex justify-between items-center relative z-10">
                  <span className="font-mono text-[10px] text-card-text/30 tracking-wider">
                    No.{String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-highlight/50 text-[10px]">&#x2726;</span>
                </div>

                {/* Image with golden frame */}
                <div className="mx-3 mb-3 relative">
                  <div className="magic-card-img-frame">
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={buddy.image_url}
                        alt={buddy.name}
                        fill
                        className="object-cover img-reveal"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="mx-4 flex items-center gap-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-highlight/20 to-transparent" />
                  <span className="text-highlight/30 text-[8px]">&#x2726;</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-highlight/20 to-transparent" />
                </div>

                {/* Info */}
                <div className="px-4 py-3 relative z-10">
                  <h3 className="font-display text-sm tracking-wider uppercase text-card-text truncate group-hover:text-highlight transition-colors duration-300">
                    {buddy.name}
                  </h3>
                  <p className="text-card-text/40 text-xs italic mt-1">
                    Summoned by {buddy.author}
                  </p>
                </div>
              </div>
            </div>
          </Card3D>
        ))}
      </div>
  );
}
