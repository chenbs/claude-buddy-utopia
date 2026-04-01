import Image from "next/image";
import { notFound } from "next/navigation";
import { getBuddyById } from "@/lib/db";
import {
  Constellation,
  CrescentMoon,
  PotionBottle,
  MagicWand,
  SpellBook,
  FloatingStars,
  MagicCircle,
} from "@/components/MagicElements";
import { DetailPageWrapper } from "@/components/DetailPageWrapper";
import { BookBackLink } from "@/components/BookTransition";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BuddyDetailPage({ params }: PageProps) {
  const { id } = await params;

  let buddy;
  try {
    buddy = await getBuddyById(id);
  } catch {
    notFound();
  }

  if (!buddy) {
    notFound();
  }

  const createdDate = new Date(buddy.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <DetailPageWrapper>
      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-12 sm:py-20 overflow-hidden">
        {/* Background decorations */}
        <FloatingStars />
        <Constellation className="absolute top-8 right-0 w-48 text-accent opacity-20" />
        <CrescentMoon className="absolute top-12 left-4 w-10 text-accent opacity-25" />
        <MagicCircle className="magic-circle-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] text-accent opacity-[0.04] pointer-events-none" />

        <BookBackLink
          className="relative z-10 inline-flex items-center gap-2 font-display text-xs tracking-[0.15em] uppercase text-muted hover:text-accent transition-colors duration-300 mb-12 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">&#x2190;</span>
          Return to Archive
        </BookBackLink>

        {/* Detail card — premium magic style */}
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Outer golden gradient border */}
          <div className="detail-card-border p-[1px] rounded-sm">
            <div className="detail-card-outer p-3 sm:p-4">
              {/* Inner content area */}
              <div className="detail-card-inner overflow-hidden relative">
                {/* Corner ornaments (4 corners) */}
                <div className="detail-corners" />

                {/* Filigree top center */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                  <svg viewBox="0 0 120 20" fill="none" className="w-24 h-4 text-accent opacity-30">
                    <path d="M60 18 Q55 10 40 8 Q30 6 20 10 Q10 14 0 12" stroke="currentColor" strokeWidth="0.8" />
                    <path d="M60 18 Q65 10 80 8 Q90 6 100 10 Q110 14 120 12" stroke="currentColor" strokeWidth="0.8" />
                    <circle cx="60" cy="4" r="2" fill="currentColor" opacity="0.4" />
                  </svg>
                </div>

                <div className="md:flex">
                  {/* Image side */}
                  <div className="md:w-1/2 relative">
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={buddy.image_url}
                        alt={buddy.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                      {/* Subtle vignette overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-card-inner/60 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Info side */}
                  <div className="md:w-1/2 p-6 sm:p-10 flex flex-col justify-center text-card-text relative">
                    {/* Background decorations */}
                    <SpellBook className="absolute top-4 right-4 w-10 h-8 text-highlight opacity-[0.08]" />
                    <MagicWand className="absolute bottom-4 right-4 w-14 h-14 text-highlight opacity-[0.06] rotate-45" />

                    {/* Label */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-px bg-highlight/30" />
                      <p className="text-highlight text-[10px] tracking-[0.35em] uppercase">
                        &#x2726; Companion Record &#x2726;
                      </p>
                      <div className="w-8 h-px bg-highlight/30" />
                    </div>

                    {/* Name */}
                    <h1 className="font-display text-2xl sm:text-3xl tracking-[0.06em] uppercase font-medium text-card-text mb-2">
                      {buddy.name}
                    </h1>
                    <p className="text-card-text/40 text-xs italic mb-8 flex items-center gap-2">
                      <span className="text-highlight/30 text-[8px]">&#x2726;</span>
                      Summoned by {buddy.author}
                      <span className="text-highlight/30 text-[8px]">&#x2726;</span>
                    </p>

                    {buddy.description && (
                      <>
                        {/* Ornate divider */}
                        <div className="flex items-center gap-3 mb-5">
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-highlight/20 to-transparent" />
                          <PotionBottle className="w-4 h-7 text-highlight opacity-25" variant={2} />
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-highlight/20 to-transparent" />
                        </div>
                        <p className="text-card-text/65 italic text-sm leading-relaxed mb-8 whitespace-pre-wrap pl-4 border-l border-highlight/15">
                          &ldquo;{buddy.description}&rdquo;
                        </p>
                      </>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-5 border-t border-card-border/20 flex items-center justify-between">
                      <p className="text-card-text/25 text-[10px] tracking-[0.15em] uppercase">
                        Registered &mdash; {createdDate}
                      </p>
                      <div className="flex gap-1">
                        <span className="text-highlight/20 text-[8px]">&#x2726;</span>
                        <span className="text-highlight/15 text-[6px]">&#x2726;</span>
                        <span className="text-highlight/20 text-[8px]">&#x2726;</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="relative z-10 flex justify-center gap-8 mt-14 opacity-20">
          <PotionBottle className="w-5 h-9 text-accent -rotate-6" variant={1} />
          <div className="flex items-center gap-2">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-accent/40" />
            <SpellBook className="w-7 h-6 text-accent" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-accent/40" />
          </div>
          <PotionBottle className="w-5 h-9 text-accent rotate-6" variant={2} />
        </div>
      </div>
    </DetailPageWrapper>
  );
}
