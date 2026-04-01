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
      <div className="py-20 sm:py-28 text-center">
        <p className="text-accent text-sm tracking-[0.3em] uppercase mb-6">
          &#x2726; The Enchanted Collection &#x2726;
        </p>
        <h1 className="font-display text-4xl sm:text-6xl tracking-[0.05em] uppercase font-medium mb-6">
          Buddy Utopia
        </h1>
        <div className="w-24 h-px bg-accent/40 mx-auto mb-6" />
        <p className="text-muted text-base sm:text-lg italic max-w-md mx-auto leading-relaxed">
          A cozy gallery for Claude Code buddies.
          <br />
          Upload yours and let the world see your companion!
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="border border-accent/30 bg-accent-light px-6 py-4 mb-10 text-center">
          <p className="text-accent text-sm italic">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!error && buddies.length === 0 && (
        <div className="text-center py-20">
          <p className="text-6xl mb-6">🦫</p>
          <h2 className="font-display text-xl tracking-[0.1em] uppercase mb-3">
            The Archive Awaits
          </h2>
          <p className="text-muted italic mb-10">
            Be the first wizard to register a companion.
          </p>
          <Link
            href="/upload"
            className="btn-magic inline-block font-display text-xs tracking-[0.15em] uppercase border border-accent/60 text-accent px-8 py-3 hover:bg-accent hover:text-background transition-colors duration-300"
          >
            Summon the First Buddy
          </Link>
        </div>
      )}

      {/* Gallery Grid */}
      {buddies.length > 0 && (
        <>
          <div className="divider-diamond mb-10">
            <span className="font-display text-xs tracking-[0.25em] uppercase text-muted px-2">
              {buddies.length} {buddies.length === 1 ? "Companion" : "Companions"} Registered
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-12">
            {buddies.map((buddy, index) => (
              <Link
                key={buddy.id}
                href={`/buddy/${buddy.id}`}
                className="buddy-card group block bg-card-bg border border-dashed border-card-border p-2 overflow-hidden"
              >
                {/* Inner card — dark like the screenshot */}
                <div className="bg-card-inner overflow-hidden">
                  {/* Index number */}
                  <div className="px-3 pt-2 pb-1 flex justify-between items-center">
                    <span className="font-mono text-[10px] text-card-text/40">
                      ({String(index + 1).padStart(2, "0")})
                    </span>
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
                  <div className="px-3 pb-3">
                    <h3 className="font-display text-sm tracking-wider uppercase text-card-text truncate group-hover:text-highlight transition-colors duration-300">
                      {buddy.name}
                    </h3>
                    <p className="text-card-text/50 text-xs italic mt-0.5">
                      by {buddy.author}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
