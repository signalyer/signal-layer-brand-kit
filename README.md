# Signal Layer brand kit

Design tokens, fonts, components, and brand assets for all Signal Layer apps. **Source-only distribution** — works with Vite, Next.js, or any bundler that handles TS/TSX from `node_modules`.

This package is the canonical source of brand truth. If you're spinning up a new Signal Layer app, install this and you're 80% of the way to brand consistency.

---

## Install

Install directly from GitHub (no NPM registry needed):

```bash
# RECOMMENDED — pin to a commit SHA, not a tag
npm install github:signalyer/signal-layer-brand-kit#<full-sha>

# Tags work but are unreliable: npm caches GitHub tags by URL+ref and
# will continue serving stale content even after a tag is force-moved.
# SHAs are content-addressed, so they never go stale.
```

To find the latest SHA, see the README at the top of `main` or `git log` the kit repo. After installing, the package `@signallayer/brand-kit` resolves from `node_modules`.

Peer deps you must already have in your app:
- `react` (>= 18)
- `react-dom`
- `framer-motion` (>= 11)
- `lucide-react` (>= 0.300)

---

## Set up Tailwind

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import brandPreset from '@signallayer/brand-kit/tokens';

export default {
  presets: [brandPreset],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // app-specific tokens go here, NOT brand tokens
    },
  },
} satisfies Config;
```

## Set up CSS tokens

```css
/* src/index.css (Vite) or src/app/globals.css (Next.js) */
@import '@signallayer/brand-kit/tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Use the components

```tsx
import { Logo, CursorGlow, Footer } from '@signallayer/brand-kit';

export default function Layout({ children }) {
  return (
    <>
      <CursorGlow />
      <header>
        <Logo />
      </header>
      {children}
      <Footer productTagline="Your product · Subtitle" />
    </>
  );
}
```

---

## Brand assets

Static files live in `assets/`. Your bundler imports them as URLs:

```tsx
// Vite
import faviconUrl from '@signallayer/brand-kit/assets/favicon.svg?url';

// Next.js (app router) — copy or re-export from your /public via build script
```

| Asset | Purpose |
|---|---|
| `assets/favicon.svg` | Vector SL mark — primary favicon |
| `assets/favicon.png` | PNG fallback for older browsers |
| `assets/favicon.ico` | ICO fallback |
| `assets/og-image.jpg` | Open Graph social card |
| `assets/signallayer-brand-logo.png` | Full lockup |
| `assets/signallayer-logo-square.png` | Square mark |

---

## Surfaces and contrast — read this before using `<Logo>` or `<Footer>`

The kit ships **only a dark theme**. Every component (`<Logo>`, `<Footer>`, `<CursorGlow>`) is designed to render on a dark canvas using the HSL tokens in `tokens.css` (`--background`, `--foreground`, `--card`, `--muted`, `--border`, etc.). The wordmark in `<Logo>` uses `text-foreground` for "Signal" — on a dark surface that reads as light gray, but on `bg-white` it disappears.

**Don't put kit components on raw light surfaces.** Specifically:

| Container background | Result |
|---|---|
| `bg-background` (default body) | ✅ correct |
| `bg-card` (elevated chrome — header, nav) | ✅ correct |
| `bg-muted`, `bg-secondary` (subtle elevated panels) | ✅ correct |
| `bg-white`, `bg-gray-50/100`, `bg-slate-50/100` | ❌ "Signal" wordmark goes invisible, tagline barely readable |
| Any custom hex like `#fff`, `#fafafa`, `#f5f5f5` | ❌ same problem |

If you need a header band that stands out from `bg-background`, use `bg-card` — it's a touch lighter than the body but still firmly in the dark family. Borders should use `border-border` or `border-border/40`, not `border-gray-200`.

If you find yourself wanting a light-bg surface for any reason, the kit isn't the right fit — talk to brand before introducing a light-mode variant.

---

## Brand rules — these are non-negotiable

1. **The brand lockup tagline is ALWAYS "AI Platform"** — never substitute with a product name. Product names live in a SEPARATE slot beside the lockup with a vertical divider:

```tsx
<div className="flex items-center gap-4">
  <Logo />
  <div className="pl-4 border-l border-border/40">
    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Product</span>
    <span className="text-sm font-heading font-semibold">My Product Name</span>
  </div>
</div>
```

2. **Visible name is "Signal Layer" — two words.** Never "Signallayer" or "SignalLayer" in copy. The wordmark renders as `Signal<gradient-text>Layer</gradient-text>` (visually one tight unit).

3. **Domain is `signallayer.ai` — one word.** That's a DNS limitation, not a brand choice. URLs always include `www.` prefix.

4. **Email is always `contact@signallayer.ai` and always uses `mailto:` scheme.**

5. **Theme is dark by default.** `<html class="dark">` should be set. Don't introduce light-mode variants without brand approval.

---

## Versioning

- This package follows [SemVer](https://semver.org).
- **Patch** = color tweak, bug fix, internal refactor.
- **Minor** = new component, new token, new utility class.
- **Major** = renamed/removed export, breaking visual change, peer-dep bump.

Tag releases: `git tag v0.1.0 && git push --tags`.

Consumers either pin to a tag (`#v0.1.0`) or track `main`. Recommended: pin tags in production apps, use `main` in scratch/staging.

---

## Apps consuming this kit

- `signalyer/ai-roi-framework` → `airoiframework.signallayer.ai`
- `signalyer/career-reality-engine` → `role.signallayer.ai`
- `signalyer/signal-claude-efficiency` → `lens.signallayer.ai`

The marketing site (`signalyer/slaiprodwebsite`) is the visual source of truth — this kit codifies the patterns it uses, so consumer apps look identical to it without re-reading its source.

---

## License

Internal Signal Layer use. Not open-sourced.
