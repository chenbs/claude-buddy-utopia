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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-muted hover:text-accent transition-colors mb-8"
      >
        ← Back to gallery
      </Link>

      <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2">
            <div className="aspect-square relative bg-accent-light">
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
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-2">{buddy.name}</h1>
            <p className="text-muted mb-4">
              by <span className="font-medium text-foreground">{buddy.author}</span>
            </p>

            {buddy.description && (
              <p className="text-foreground/80 leading-relaxed mb-6 whitespace-pre-wrap">
                {buddy.description}
              </p>
            )}

            <div className="mt-auto pt-4 border-t border-card-border">
              <p className="text-muted text-sm">
                Uploaded on {createdDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
