import { Mail, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';

export interface FooterProps {
  /** Optional product label rendered next to the brand mark. */
  productTagline?: string;
  /** Override the canonical website URL. */
  websiteUrl?: string;
  /** Override the contact email. */
  contactEmail?: string;
  /** Override copyright text. Default: "© <year> Signal Layer". */
  copyright?: string;
  className?: string;
}

const DEFAULT_URL = 'https://www.signallayer.ai';
const DEFAULT_EMAIL = 'contact@signallayer.ai';

/**
 * Canonical Signal Layer footer.
 *
 * - Top: 1px gradient accent line (transparent → primary/40 → transparent)
 * - Left: Logo lockup (size 8) with optional product subtitle
 * - Right: website link + mailto + © Signal Layer
 *
 * Apps can wrap or compose this with additional product-specific links.
 */
export function Footer({
  productTagline,
  websiteUrl = DEFAULT_URL,
  contactEmail = DEFAULT_EMAIL,
  copyright,
  className = '',
}: FooterProps) {
  const year = new Date().getFullYear();
  const copyText = copyright ?? `© ${year} Signal Layer`;
  return (
    <footer className={`relative border-t border-border/40 mt-12 ${className}`}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <Logo size={8} noHover />
            {productTagline && (
              <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">
                {productTagline}
              </span>
            )}
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              www.signallayer.ai
              <ArrowUpRight size={12} />
            </a>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail size={12} />
              {contactEmail}
            </a>
            <span className="text-xs text-muted-foreground/70 font-mono">{copyText}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
