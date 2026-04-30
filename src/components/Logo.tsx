'use client';

import { motion } from 'framer-motion';

export interface LogoProps {
  /** Show the wordmark next to the SL mark. Default: true. */
  showWordmark?: boolean;
  /** Tagline below the wordmark. Default: canonical brand tagline "AI Platform". */
  tagline?: string;
  /** Size of the square mark in Tailwind units. Default: 9 (36px). */
  size?: 8 | 9 | 10 | 12;
  /** Disable hover/tap animation (e.g. for static/footer contexts). Default: false. */
  noHover?: boolean;
  /** Extra classes for the outer container. */
  className?: string;
}

// Static class names so Tailwind's content scanner can compile them. NEVER
// use template-literal class composition like `w-${size}` — Tailwind reads
// source as plain text and won't see those classes.
const SIZE_CLASSES: Record<NonNullable<LogoProps['size']>, { box: string; text: string }> = {
  8: { box: 'w-8 h-8', text: 'text-sm' },
  9: { box: 'w-9 h-9', text: 'text-base' },
  10: { box: 'w-10 h-10', text: 'text-lg' },
  12: { box: 'w-12 h-12', text: 'text-xl' },
};

/**
 * Signal Layer logo lockup — canonical brand mark.
 *
 * - 36px (size=9) rounded-xl square with var(--gradient-primary) background
 * - 8px white grid overlay at 20% opacity for subtle tech texture
 * - "SL" in heading font (Syne), bold, dark foreground
 * - Wordmark: "Signal" foreground + "Layer" with .gradient-text
 * - Hover: scale 1.08, tap: scale 0.95 (spring physics via framer-motion)
 *
 * REQUIRES A DARK CANVAS. The wordmark uses `text-foreground` (light) and
 * `text-muted-foreground` (medium-light) — both will go nearly invisible on
 * `bg-white` or any other light surface. Place this on `bg-background`,
 * `bg-card`, `bg-muted`, or `bg-secondary`. Never on raw white. See the
 * README's "Surfaces and contrast" section for the full table.
 *
 * The brand lockup tagline is ALWAYS "AI Platform" — never substitute
 * with a product name. Product names go in a SEPARATE slot, e.g.:
 *
 *     <div className="flex items-center gap-4">
 *       <Logo />
 *       <div className="pl-4 border-l border-border/40">
 *         <span className="text-sm font-semibold">My Product Name</span>
 *       </div>
 *     </div>
 */
export function Logo({
  showWordmark = true,
  tagline = 'AI Platform',
  size = 9,
  noHover = false,
  className = '',
}: LogoProps) {
  const { box, text } = SIZE_CLASSES[size];

  const motionProps = noHover
    ? {}
    : {
        whileHover: { scale: 1.08 },
        whileTap: { scale: 0.95 },
        transition: { type: 'spring' as const, stiffness: 400, damping: 22 },
      };

  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      <motion.div
        className={`relative ${box} rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0`}
        style={{ background: 'var(--gradient-primary)' }}
        {...motionProps}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(0deg, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
          }}
        />
        <span
          className={`relative font-heading font-bold text-background ${text} tracking-tight`}
        >
          SL
        </span>
      </motion.div>
      {showWordmark && (
        <div className="flex flex-col leading-none min-w-0">
          <span className="font-heading font-bold text-lg text-foreground tracking-tight whitespace-nowrap">
            Signal<span className="gradient-text">Layer</span>
          </span>
          {tagline && (
            <span className="text-[10px] text-muted-foreground font-body tracking-widest uppercase mt-0.5 truncate">
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
