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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Welcome to <span className="text-accent">Buddy Utopia</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          A cozy gallery for Claude Code buddies. Upload yours and let the world
          see your companion!
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 text-center">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!error && buddies.length === 0 && (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🦫</p>
          <h2 className="text-2xl font-semibold mb-2">No buddies yet!</h2>
          <p className="text-muted mb-6">
            Be the first one to share your Claude buddy.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            Upload the first buddy
          </Link>
        </div>
      )}

      {/* Gallery Grid */}
      {buddies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {buddies.map((buddy) => (
            <Link
              key={buddy.id}
              href={`/buddy/${buddy.id}`}
              className="buddy-card group block bg-card-bg border border-card-border rounded-xl overflow-hidden"
            >
              <div className="aspect-square relative bg-accent-light">
                <Image
                  src={buddy.image_url}
                  alt={buddy.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">
                  {buddy.name}
                </h3>
                <p className="text-muted text-sm">by {buddy.author}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
