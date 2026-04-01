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
      {/* Hero — asymmetric editorial layout */}
      <div className="pt-20 pb-16 sm:pt-28 sm:pb-20 max-w-3xl">
        <p className="text-sm font-medium tracking-[0.2em] uppercase text-accent mb-6">
          The Companion Gallery
        </p>
        <h1 className="font-display text-5xl sm:text-7xl leading-[1.05] mb-6">
          Welcome to{" "}
          <span className="italic text-accent">Buddy Utopia</span>
        </h1>
        <p className="text-muted text-lg sm:text-xl leading-relaxed max-w-lg">
          A cozy gallery for Claude Code buddies.
          <br />
          Upload yours and let the world see your companion!
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-accent-light border-l-4 border-accent rounded-r-lg p-4 mb-10">
          <p className="text-accent font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!error && buddies.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-7xl mb-6">🦫</p>
          <h2 className="font-display text-3xl italic mb-3">No buddies yet!</h2>
          <p className="text-muted mb-8 text-lg">
            Be the first one to share your Claude buddy.
          </p>
          <Link
            href="/upload"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-full font-medium tracking-wide uppercase text-sm"
          >
            Upload the first buddy
          </Link>
        </div>
      )}

      {/* Gallery Grid */}
      {buddies.length > 0 && (
        <>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-2xl italic">All Buddies</h2>
            <div className="flex-1 h-px bg-card-border/60" />
            <span className="text-muted text-sm font-mono">{buddies.length}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-12">
            {buddies.map((buddy) => (
              <Link
                key={buddy.id}
                href={`/buddy/${buddy.id}`}
                className="buddy-card group block bg-card-bg border border-card-border rounded-2xl overflow-hidden"
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
                <div className="p-4">
                  <h3 className="font-medium text-base truncate group-hover:text-accent transition-colors duration-300">
                    {buddy.name}
                  </h3>
                  <p className="text-muted text-xs mt-1 tracking-wide uppercase">
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
