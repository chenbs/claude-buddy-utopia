import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBuddyById } from "@/lib/db";

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
    <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-12 sm:py-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-display text-xs tracking-[0.15em] uppercase text-muted hover:text-accent transition-colors duration-300 mb-12"
      >
        <span>&#x2190;</span> Return to Archive
      </Link>

      {/* Card — stamp style wrapper */}
      <div className="bg-card-bg border border-dashed border-card-border p-3 sm:p-4 max-w-4xl mx-auto">
        <div className="ornate-frame bg-card-inner overflow-hidden">
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/2">
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
            <div className="md:w-1/2 p-6 sm:p-10 flex flex-col justify-center text-card-text">
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
                  <div className="w-12 h-px bg-highlight/30 mb-4" />
                  <p className="text-card-text/70 italic text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                    &ldquo;{buddy.description}&rdquo;
                  </p>
                </>
              )}

              <div className="mt-auto pt-5 border-t border-card-border/30">
                <p className="text-card-text/30 text-xs tracking-wider uppercase">
                  Registered &mdash; {createdDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
