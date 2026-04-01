"use client";

import Image from "next/image";
import { BookTransitionProvider, BookCardLink } from "./BookTransition";

interface Buddy {
  id: string;
  name: string;
  author: string;
  image_url: string;
  description: string | null;
  created_at: string;
}

export function BuddyGallery({ buddies }: { buddies: Buddy[] }) {
  return (
    <BookTransitionProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-12">
        {buddies.map((buddy, index) => (
          <BookCardLink
            key={buddy.id}
            href={`/buddy/${buddy.id}`}
            className="buddy-card group block bg-card-bg border border-dashed border-card-border p-2 overflow-hidden"
          >
            {/* Inner card */}
            <div className="bg-card-inner overflow-hidden relative">
              {/* Ornate corners on the inner card */}
              <div className="ornate-frame ornate-corners absolute inset-0 pointer-events-none" />

              {/* Index */}
              <div className="px-3 pt-2.5 pb-1 flex justify-between items-center relative z-10">
                <span className="font-mono text-[10px] text-card-text/40">
                  ({String(index + 1).padStart(2, "0")})
                </span>
                {/* Small decorative star */}
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
          </BookCardLink>
        ))}
      </div>
    </BookTransitionProvider>
  );
}
