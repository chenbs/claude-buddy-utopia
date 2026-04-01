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
    <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-16 sm:py-24">
      <Link
        href="/"
        className="inline-block text-xs tracking-[0.1em] uppercase text-muted hover:text-foreground transition-colors duration-300 mb-12"
      >
        Back
      </Link>

      <div className="md:flex md:gap-16">
        {/* Image */}
        <div className="md:w-1/2 mb-10 md:mb-0">
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
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="font-display text-4xl sm:text-5xl font-light tracking-tight mb-3">
            {buddy.name}
          </h1>
          <p className="text-xs tracking-[0.1em] uppercase text-muted mb-8">
            {buddy.author}
          </p>

          {buddy.description && (
            <p className="text-foreground/70 text-sm leading-relaxed mb-10 whitespace-pre-wrap">
              {buddy.description}
            </p>
          )}

          <div className="mt-auto pt-6 border-t border-card-border">
            <p className="text-muted text-xs tracking-wide">
              {createdDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
