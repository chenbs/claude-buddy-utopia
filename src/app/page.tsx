import Image from "next/image";
import Link from "next/link";
import { getAllBuddies } from "@/lib/db";

// Revalidate every 60 seconds so new uploads show up
export const revalidate = 60;

export default async function HomePage() {
  let buddies: Awaited<ReturnType<typeof getAllBuddies>> = [];
  let error: string | null = null;

  try {
    buddies = await getAllBuddies();
  } catch (e) {
    console.error("Failed to load buddies:", e);
    error =
      "Could not connect to the database. Make sure DATABASE_URL is set.";
  }

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
      {/* Hero */}
      <div className="py-24 sm:py-32 text-center">
        <h1 className="font-display text-5xl sm:text-7xl font-light tracking-tight mb-6">
          Buddy Utopia
        </h1>
        <p className="text-muted text-sm sm:text-base tracking-wide max-w-md mx-auto leading-relaxed">
          A cozy gallery for Claude Code buddies.
          <br />
          Upload yours and let the world see your companion!
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="border border-card-border px-6 py-4 mb-12 text-center">
          <p className="text-muted text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!error && buddies.length === 0 && (
        <div className="text-center py-24">
          <p className="text-5xl mb-8">🦫</p>
          <h2 className="font-display text-2xl font-light mb-3">No buddies yet</h2>
          <p className="text-muted text-sm mb-10">
            Be the first one to share your Claude buddy.
          </p>
          <Link
            href="/upload"
            className="btn-primary inline-block text-xs tracking-[0.15em] uppercase font-medium border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-colors duration-300"
          >
            Upload the first buddy
          </Link>
        </div>
      )}

      {/* Gallery Grid */}
      {buddies.length > 0 && (
        <>
          <div className="flex items-center gap-6 mb-10">
            <div className="flex-1 h-px bg-card-border" />
            <span className="text-xs tracking-[0.2em] uppercase text-muted">
              {buddies.length} {buddies.length === 1 ? "buddy" : "buddies"}
            </span>
            <div className="flex-1 h-px bg-card-border" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-12">
            {buddies.map((buddy) => (
              <Link
                key={buddy.id}
                href={`/buddy/${buddy.id}`}
                className="buddy-card group block bg-card-bg border border-card-border overflow-hidden"
              >
                <div className="aspect-square relative bg-surface overflow-hidden">
                  <Image
                    src={buddy.image_url}
                    alt={buddy.name}
                    fill
                    className="object-cover img-reveal"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <div className="px-4 py-4">
                  <h3 className="text-sm font-medium truncate">
                    {buddy.name}
                  </h3>
                  <p className="text-muted text-xs mt-1">
                    {buddy.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
