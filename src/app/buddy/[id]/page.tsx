import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBuddyById } from "@/lib/db";
import {
  Constellation,
  CrescentMoon,
  PotionBottle,
  MagicWand,
  SpellBook,
  FloatingStars,
} from "@/components/MagicElements";

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
    <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-12 sm:py-20 overflow-hidden">
      {/* Background decorations */}
      <FloatingStars />
      <Constellation className="absolute top-8 right-0 w-48 text-accent opacity-20" />
      <CrescentMoon className="absolute top-12 left-4 w-10 text-accent opacity-25" />

      <Link
        href="/"
        className="relative z-10 inline-flex items-center gap-2 font-display text-xs tracking-[0.15em] uppercase text-muted hover:text-accent transition-colors duration-300 mb-12"
      >
        <span>&#x2190;</span> Return to Archive
      </Link>

      {/* Card — stamp style wrapper */}
      <div className="relative z-10 bg-card-bg border border-dashed border-card-border p-3 sm:p-4 max-w-4xl mx-auto">
        <div className="ornate-frame bg-card-inner overflow-hidden">
          {/* Extra ornate corners */}
          <div className="ornate-corners absolute inset-0 pointer-events-none z-10" />

          <div className="md:flex">
            {/* Image */}
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
              </div>
            </div>

            {/* Info */}
            <div className="md:w-1/2 p-6 sm:p-10 flex flex-col justify-center text-card-text relative">
              {/* Decorative elements inside the info panel */}
              <SpellBook className="absolute top-4 right-4 w-10 h-8 text-highlight opacity-15" />
              <MagicWand className="absolute bottom-4 right-4 w-12 h-12 text-highlight opacity-10 rotate-45" />

              <p className="text-highlight text-xs tracking-[0.3em] uppercase mb-4">
                &#x2726; Companion Record &#x2726;
              </p>
              <h1 className="font-display text-2xl sm:text-3xl tracking-[0.05em] uppercase font-medium text-card-text mb-2">
                {buddy.name}
              </h1>
              <p className="text-card-text/50 text-xs italic mb-6">
                Summoned by {buddy.author}
              </p>

              {buddy.description && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-px bg-highlight/30" />
                    <PotionBottle className="w-4 h-7 text-highlight opacity-30" variant={2} />
                    <div className="w-8 h-px bg-highlight/30" />
                  </div>
                  <p className="text-card-text/70 italic text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                    &ldquo;{buddy.description}&rdquo;
                  </p>
                </>
              )}

              <div className="mt-auto pt-5 border-t border-card-border/30 flex items-center justify-between">
                <p className="text-card-text/30 text-xs tracking-wider uppercase">
                  Registered &mdash; {createdDate}
                </p>
                <span className="text-highlight/25 text-xs">&#x2726;</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative potions */}
      <div className="relative z-10 flex justify-center gap-6 mt-12 opacity-25">
        <PotionBottle className="w-6 h-10 text-accent -rotate-6" variant={1} />
        <SpellBook className="w-8 h-7 text-accent" />
        <PotionBottle className="w-6 h-10 text-accent rotate-6" variant={2} />
      </div>
    </div>
  );
}
