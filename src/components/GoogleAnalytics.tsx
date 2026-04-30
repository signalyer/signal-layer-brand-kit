'use client';

import { useEffect } from 'react';

interface GoogleAnalyticsProps {
  /** GA4 measurement ID. Defaults to the canonical Signal Layer property. */
  measurementId?: string;
  /** Cookiebot consent banner ID. Defaults to Signal Layer's. Pass empty string to disable. */
  cookiebotId?: string;
  /** Disable consent mode v2 defaults (e.g. for environments without Cookiebot). Default: false. */
  noConsentMode?: boolean;
}

const DEFAULT_MEASUREMENT_ID = 'G-1LK1QQX5GN';
const DEFAULT_COOKIEBOT_ID = 'ca7017eb-4a62-4917-a728-f7b63dd21487';

/**
 * GA4 + Consent Mode v2 + Cookiebot — canonical Signal Layer analytics setup.
 *
 * Mirrors the pattern used in signallayer.ai's index.html. Loads:
 *  1. gtag stub + consent defaults (everything denied except functionality + security)
 *  2. Cookiebot consent banner (auto blocking mode)
 *  3. GA4 tag with anonymized IP + SameSite=None;Secure cookies
 *
 * Mount once at the top of your app's layout. Idempotent.
 */
export function GoogleAnalytics({
  measurementId = DEFAULT_MEASUREMENT_ID,
  cookiebotId = DEFAULT_COOKIEBOT_ID,
  noConsentMode = false,
}: GoogleAnalyticsProps = {}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const w = window as unknown as Record<string, unknown>;
    const FLAG = '__signal_layer_ga_loaded';
    if (w[FLAG]) return;
    w[FLAG] = true;

    // Bootstrap dataLayer + gtag stub via inline script (mirrors marketing site).
    // Doing it via injected <script> ensures the gtag stub uses `arguments`
    // properly — TypeScript can't model that pattern, so we keep it as plain JS.
    const bootstrap = document.createElement('script');
    bootstrap.text = [
      'window.dataLayer = window.dataLayer || [];',
      'function gtag(){dataLayer.push(arguments);}',
      noConsentMode
        ? ''
        : `gtag('consent', 'default', {ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});`,
      `gtag('js', new Date());`,
      `gtag('config', '${measurementId}', {anonymize_ip:true,cookie_flags:'SameSite=None;Secure'});`,
    ].join('\n');
    document.head.appendChild(bootstrap);

    // Cookiebot (loads consent banner; updates consent mode based on user choice)
    if (cookiebotId) {
      const cb = document.createElement('script');
      cb.id = 'Cookiebot';
      cb.src = 'https://consent.cookiebot.com/uc.js';
      cb.setAttribute('data-cbid', cookiebotId);
      cb.setAttribute('data-blockingmode', 'auto');
      cb.type = 'text/javascript';
      document.head.appendChild(cb);
    }

    // GA4 tag
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(gtagScript);
  }, [measurementId, cookiebotId, noConsentMode]);

  return null;
}
