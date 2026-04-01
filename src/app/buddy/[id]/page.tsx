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
    <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-12 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm tracking-wide uppercase text-muted hover:text-accent transition-colors duration-300 mb-10"
      >
        <span className="text-lg">←</span> Back to gallery
      </Link>

      <div className="bg-card-bg border border-card-border rounded-3xl overflow-hidden shadow-sm">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2">
            <div className="aspect-square relative bg-surface overflow-hidden">
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
          <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-accent mb-4">
              Meet the buddy
            </p>
            <h1 className="font-display text-4xl sm:text-5xl italic mb-3">
              {buddy.name}
            </h1>
            <p className="text-muted text-sm tracking-wide uppercase mb-6">
              by <span className="text-foreground">{buddy.author}</span>
            </p>

            {buddy.description && (
              <p className="text-foreground/75 leading-relaxed text-base mb-8 whitespace-pre-wrap">
                {buddy.description}
              </p>
            )}

            <div className="mt-auto pt-6 border-t border-card-border/60">
              <p className="text-muted text-xs tracking-wide uppercase">
                Uploaded on {createdDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
