import Link from "next/link";
import { getAllBuddies } from "@/lib/db";
import {
  MagicCircle,
  CrescentMoon,
  Constellation,
  FloatingStars,
  PotionBottle,
  SpellBook,
  MagicWand,
  CrystalBall,
  MagicDivider,
  WizardHat,
} from "@/components/MagicElements";
import { BuddyGallery } from "@/components/BuddyGallery";

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
      {/* ======= HERO with magical decorations ======= */}
      <div className="relative py-24 sm:py-32 text-center overflow-hidden">
        {/* Floating sparkle particles */}
        <FloatingStars />

        {/* Large magic circle behind title — slowly rotating */}
        <MagicCircle className="magic-circle-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] text-accent pointer-events-none" />

        {/* Crescent moon — top right */}
        <CrescentMoon className="absolute top-6 right-8 sm:right-16 w-10 sm:w-14 text-accent opacity-40" />

        {/* Constellation — top left */}
        <Constellation className="absolute top-10 left-4 sm:left-10 w-40 sm:w-56 text-accent opacity-30" />

        {/* Wizard hat — decorative */}
        <WizardHat className="absolute bottom-8 left-8 sm:left-20 w-12 sm:w-16 text-accent opacity-25 -rotate-12" />

        {/* Magic wand — bottom right */}
        <MagicWand className="absolute bottom-6 right-6 sm:right-16 w-14 sm:w-20 text-accent opacity-25 rotate-12" />

        {/* Title */}
        <div className="relative z-10">
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
      </div>

      {/* Decorative row: potion + book + wand icons */}
      <MagicDivider className="mb-12" />

      {/* Error State */}
      {error && (
        <div className="border border-accent/30 bg-accent-light px-6 py-4 mb-10 text-center">
          <p className="text-accent text-sm italic">{error}</p>
        </div>
      )}

      {/* ======= EMPTY STATE with crystal ball ======= */}
      {!error && buddies.length === 0 && (
        <div className="relative text-center py-16">
          {/* Crystal ball illustration */}
          <CrystalBall className="w-28 h-32 sm:w-36 sm:h-40 mx-auto text-accent mb-8 summon-pulse" />

          <h2 className="font-display text-xl tracking-[0.1em] uppercase mb-3">
            The Archive Awaits
          </h2>
          <p className="text-muted italic mb-10 max-w-xs mx-auto">
            The crystal ball sees no companions yet. Be the first wizard to register one.
          </p>
          <Link
            href="/upload"
            className="btn-magic inline-block font-display text-xs tracking-[0.15em] uppercase border border-accent/60 text-accent px-8 py-3 hover:bg-accent hover:text-background transition-colors duration-300"
          >
            Summon the First Buddy
          </Link>

          {/* Decorative potions beside */}
          <PotionBottle className="absolute left-8 sm:left-24 bottom-4 w-8 h-14 text-accent opacity-20 rotate-6" variant={1} />
          <PotionBottle className="absolute right-8 sm:right-24 bottom-8 w-7 h-12 text-accent opacity-20 -rotate-6" variant={2} />
        </div>
      )}

      {/* ======= GALLERY ======= */}
      {buddies.length > 0 && (
        <>
          {/* Section header with decorations */}
          <div className="relative mb-10">
            <div className="divider-diamond">
              <span className="flex items-center gap-3 px-2">
                <SpellBook className="w-6 h-5 text-accent opacity-40" />
                <span className="font-display text-xs tracking-[0.25em] uppercase text-muted">
                  {buddies.length} {buddies.length === 1 ? "Companion" : "Companions"} Registered
                </span>
                <SpellBook className="w-6 h-5 text-accent opacity-40 scale-x-[-1]" />
              </span>
            </div>
          </div>

          <BuddyGallery buddies={buddies} />
        </>
      )}
    </div>
  );
}
