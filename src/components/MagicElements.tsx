// All magical SVG illustrations and decorative components

export function MagicCircle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring */}
      <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <circle cx="200" cy="200" r="170" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
      <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" opacity="0.12" strokeDasharray="8 6" />
      {/* Inner ring with rune marks */}
      <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="0.3" opacity="0.1" />
      {/* Star pentagram */}
      <polygon
        points="200,30 238,150 370,150 260,220 298,340 200,270 102,340 140,220 30,150 162,150"
        stroke="currentColor" strokeWidth="0.5" opacity="0.08" fill="none"
      />
      {/* Rune-like marks around the circle */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 200 + 155 * Math.cos(rad);
        const y1 = 200 + 155 * Math.sin(rad);
        const x2 = 200 + 165 * Math.cos(rad);
        const y2 = 200 + 165 * Math.sin(rad);
        return (
          <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
        );
      })}
      {/* Inner cross */}
      <line x1="200" y1="80" x2="200" y2="320" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
      <line x1="80" y1="200" x2="320" y2="200" stroke="currentColor" strokeWidth="0.3" opacity="0.08" />
      {/* Small circles at cardinal points */}
      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 200 + 120 * Math.cos(rad);
        const cy = 200 + 120 * Math.sin(rad);
        return <circle key={angle} cx={cx} cy={cy} r="3" fill="currentColor" opacity="0.12" />;
      })}
    </svg>
  );
}

export function CrescentMoon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 5C25 5 13 17 13 32s12 27 27 27c4 0 8-1 11-2.5C45 53 40 45 40 35S45 17 51 13c-3-5-7-8-11-8z" opacity="0.7" />
      {/* Small star beside */}
      <polygon points="52,8 53.5,12 57,12 54,14.5 55.5,18 52,16 48.5,18 50,14.5 47,12 50.5,12" opacity="0.5" />
    </svg>
  );
}

export function Constellation({ className = "" }: { className?: string }) {
  const stars = [
    { x: 30, y: 20, r: 2 }, { x: 80, y: 45, r: 1.5 }, { x: 55, y: 70, r: 2.5 },
    { x: 120, y: 30, r: 1.8 }, { x: 150, y: 65, r: 2 }, { x: 100, y: 80, r: 1.5 },
    { x: 170, y: 25, r: 1 }, { x: 190, y: 55, r: 2.2 }, { x: 140, y: 90, r: 1.5 },
    { x: 220, y: 40, r: 1.8 }, { x: 250, y: 70, r: 2 }, { x: 200, y: 85, r: 1.2 },
  ];
  const lines = [
    [0,1],[1,2],[1,3],[3,4],[4,5],[2,5],[3,6],[6,7],[7,4],[7,9],[9,10],[10,11],[8,5],[8,11],
  ];
  return (
    <svg viewBox="0 0 280 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {lines.map(([a, b], i) => (
        <line key={i}
          x1={stars[a].x} y1={stars[a].y} x2={stars[b].x} y2={stars[b].y}
          stroke="currentColor" strokeWidth="0.5" opacity="0.25"
        />
      ))}
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="currentColor" opacity="0.4" />
      ))}
    </svg>
  );
}

export function PotionBottle({ className = "", variant = 1 }: { className?: string; variant?: number }) {
  if (variant === 2) {
    return (
      <svg viewBox="0 0 40 70" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Round flask */}
        <rect x="14" y="2" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
        <line x1="14" y1="7" x2="26" y2="7" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        <path d="M14 12 L8 28 Q4 40 8 52 Q12 62 20 64 Q28 62 32 52 Q36 40 32 28 L26 12" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
        {/* Liquid */}
        <path d="M10 38 Q8 48 12 55 Q16 62 20 63 Q24 62 28 55 Q32 48 30 38 Z" fill="currentColor" opacity="0.12" />
        {/* Bubbles */}
        <circle cx="18" cy="48" r="2" fill="currentColor" opacity="0.15" />
        <circle cx="23" cy="43" r="1.5" fill="currentColor" opacity="0.1" />
        <circle cx="16" cy="54" r="1" fill="currentColor" opacity="0.12" />
        {/* Sparkle on top */}
        <line x1="20" y1="0" x2="20" y2="3" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        <line x1="18.5" y1="1.5" x2="21.5" y2="1.5" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 70" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Neck */}
      <rect x="15" y="2" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <line x1="15" y1="8" x2="25" y2="8" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      {/* Body */}
      <path d="M15 16 L8 30 L8 55 Q8 63 16 65 L24 65 Q32 63 32 55 L32 30 L25 16" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      {/* Liquid level */}
      <path d="M9 40 L9 55 Q9 62 16 64 L24 64 Q31 62 31 55 L31 40 Z" fill="currentColor" opacity="0.1" />
      {/* Label */}
      <rect x="12" y="36" width="16" height="10" rx="1" stroke="currentColor" strokeWidth="0.6" opacity="0.2" />
      <line x1="15" y1="39" x2="25" y2="39" stroke="currentColor" strokeWidth="0.4" opacity="0.15" />
      <line x1="15" y1="42" x2="22" y2="42" stroke="currentColor" strokeWidth="0.4" opacity="0.15" />
      {/* Cork */}
      <rect x="16" y="1" width="8" height="4" rx="1.5" fill="currentColor" opacity="0.15" />
    </svg>
  );
}

export function SpellBook({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 70" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Back cover */}
      <rect x="8" y="6" width="60" height="58" rx="3" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Front cover */}
      <rect x="4" y="2" width="60" height="58" rx="3" stroke="currentColor" strokeWidth="1.2" opacity="0.5" fill="currentColor" fillOpacity="0.03" />
      {/* Spine */}
      <line x1="12" y1="4" x2="12" y2="58" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
      {/* Decorative border on cover */}
      <rect x="16" y="10" width="40" height="42" rx="1" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      {/* Star emblem */}
      <polygon points="36,20 38,26 44,26 39,30 41,36 36,32 31,36 33,30 28,26 34,26" fill="currentColor" opacity="0.2" />
      {/* Text lines */}
      <line x1="24" y1="40" x2="48" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <line x1="28" y1="44" x2="44" y2="44" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      {/* Clasp */}
      <path d="M64 25 L70 25 L70 35 L64 35" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="70" cy="30" r="2" fill="currentColor" opacity="0.15" />
      {/* Sparkles */}
      <circle cx="50" cy="14" r="1" fill="currentColor" opacity="0.25" />
      <circle cx="22" cy="48" r="0.8" fill="currentColor" opacity="0.2" />
      <circle cx="52" cy="50" r="1.2" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

export function MagicWand({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wand body */}
      <line x1="15" y1="65" x2="58" y2="22" stroke="currentColor" strokeWidth="2.5" opacity="0.5" strokeLinecap="round" />
      {/* Handle grip */}
      <line x1="15" y1="65" x2="25" y2="55" stroke="currentColor" strokeWidth="3.5" opacity="0.35" strokeLinecap="round" />
      <circle cx="20" cy="60" r="1.5" fill="currentColor" opacity="0.2" />
      {/* Tip glow */}
      <circle cx="60" cy="20" r="4" fill="currentColor" opacity="0.15" />
      <circle cx="60" cy="20" r="8" fill="currentColor" opacity="0.05" />
      {/* Sparkles from tip */}
      <polygon points="65,10 66,13 69,13 66.5,15.5 68,18 65,16.5 62,18 63.5,15.5 61,13 64,13" fill="currentColor" opacity="0.35" />
      <polygon points="72,18 72.8,20 75,20 73.2,21.5 74,23.5 72,22 70,23.5 70.8,21.5 69,20 71.2,20" fill="currentColor" opacity="0.25" />
      <polygon points="58,8 58.6,9.5 60,9.5 59,10.5 59.5,12 58,11 56.5,12 57,10.5 56,9.5 57.4,9.5" fill="currentColor" opacity="0.2" />
      {/* Trail sparkles */}
      <circle cx="68" cy="14" r="0.8" fill="currentColor" opacity="0.3" />
      <circle cx="63" cy="6" r="0.6" fill="currentColor" opacity="0.2" />
      <circle cx="74" cy="22" r="0.5" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

export function CrystalBall({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 110" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base/stand */}
      <ellipse cx="50" cy="100" rx="28" ry="6" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M30 95 Q30 100 32 102" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <path d="M70 95 Q70 100 68 102" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <path d="M35 88 Q50 94 65 88" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      {/* Ball */}
      <circle cx="50" cy="48" r="40" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      {/* Glass shine */}
      <path d="M30 30 Q38 20 50 18" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
      {/* Inner mist */}
      <circle cx="50" cy="48" r="30" fill="currentColor" opacity="0.03" />
      <ellipse cx="45" cy="45" rx="15" ry="12" fill="currentColor" opacity="0.04" />
      {/* Stars inside */}
      <polygon points="42,35 43,38 46,38 43.5,40 44.5,43 42,41 39.5,43 40.5,40 38,38 41,38" fill="currentColor" opacity="0.2" />
      <polygon points="58,50 59,52 61,52 59.5,53.5 60,55.5 58,54 56,55.5 56.5,53.5 55,52 57,52" fill="currentColor" opacity="0.15" />
      <circle cx="50" cy="60" r="1" fill="currentColor" opacity="0.15" />
      <circle cx="38" cy="52" r="0.8" fill="currentColor" opacity="0.12" />
      {/* Outer glow */}
      <circle cx="50" cy="48" r="44" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
    </svg>
  );
}

export function FloatingStars({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {/* Animated sparkle dots */}
      <div className="sparkle sparkle-1" />
      <div className="sparkle sparkle-2" />
      <div className="sparkle sparkle-3" />
      <div className="sparkle sparkle-4" />
      <div className="sparkle sparkle-5" />
      <div className="sparkle sparkle-6" />
      <div className="sparkle sparkle-7" />
      <div className="sparkle sparkle-8" />
    </div>
  );
}

export function WizardHat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hat body */}
      <path d="M40 4 L20 55 L60 55 Z" stroke="currentColor" strokeWidth="1.2" opacity="0.4" fill="currentColor" fillOpacity="0.05" />
      {/* Brim */}
      <ellipse cx="40" cy="55" rx="30" ry="8" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      {/* Band */}
      <path d="M22 50 Q40 44 58 50" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      {/* Buckle */}
      <rect x="35" y="45" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <rect x="38" y="47" width="4" height="4" rx="0.5" fill="currentColor" opacity="0.15" />
      {/* Tip bend */}
      <path d="M40 4 Q50 8 48 16" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Star at tip */}
      <polygon points="48,14 49,16.5 51.5,16.5 49.5,18 50.5,20.5 48,19 45.5,20.5 46.5,18 44.5,16.5 47,16.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

export function ScrollBanner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Scroll ends */}
      <div className="absolute -left-3 top-0 bottom-0 w-3 border-y border-l border-card-border rounded-l-full opacity-30" />
      <div className="absolute -right-3 top-0 bottom-0 w-3 border-y border-r border-card-border rounded-r-full opacity-30" />
      <div className="border-y border-card-border/50 py-3 px-6 bg-surface/30 text-center">
        {children}
      </div>
    </div>
  );
}

export function MagicDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-card-border to-transparent" />
      <PotionBottle className="w-5 h-8 text-accent opacity-40" variant={1} />
      <div className="text-accent opacity-30 text-xs">&#x2726;</div>
      <SpellBook className="w-7 h-6 text-accent opacity-35" />
      <div className="text-accent opacity-30 text-xs">&#x2726;</div>
      <PotionBottle className="w-5 h-8 text-accent opacity-40" variant={2} />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-card-border to-transparent" />
    </div>
  );
}
