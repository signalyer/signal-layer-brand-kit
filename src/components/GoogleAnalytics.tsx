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

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GA4 + Consent Mode v2 + Cookiebot — canonical Signal Layer analytics setup.
 *
 * Mirrors the pattern used in signallayer.ai's index.html. Loads:
 *  1. gtag stub + consent defaults (everything denied except functionality + security)
 *  2. Cookiebot consent banner (auto blocking mode)
 *  3. GA4 tag with anonymized IP + SameSite=None;Secure cookies
 *
 * Mount once at the top of your app's layout. Idempotent — safe to mount more
 * than once but the scripts will only load on first mount.
 *
 * Usage:
 *   import { GoogleAnalytics } from '@signallayer/brand-kit';
 *   <GoogleAnalytics />                              // canonical Signal Layer config
 *   <GoogleAnalytics measurementId="G-OTHER" />      // override GA property
 *   <GoogleAnalytics cookiebotId="" />               // disable Cookiebot
 *   <GoogleAnalytics noConsentMode />                // disable Consent Mode v2 defaults
 */
export function GoogleAnalytics({
  measurementId = DEFAULT_MEASUREMENT_ID,
  cookiebotId = DEFAULT_COOKIEBOT_ID,
  noConsentMode = false,
}: GoogleAnalyticsProps = {}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Idempotency guard
    const FLAG = '__signal_layer_ga_loaded';
    if ((window as unknown as Record<string, unknown>)[FLAG]) return;
    (window as unknown as Record<string, unknown>)[FLAG] = true;

    window.dataLayer = window.dataLayer || [];
    // Inline definition — gtag must be a regular function, not arrow, to use arguments.
    function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    }
    window.gtag = gtag as unknown as typeof window.gtag;

    // 1. Consent Mode v2 defaults (must be set BEFORE gtag.js loads)
    if (!noConsentMode) {
      gtag.call(
        null,
        'consent',
        'default',
        {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          functionality_storage: 'granted',
          security_storage: 'granted',
          wait_for_update: 500,
        }
      );
    }

    // 2. Cookiebot (loads consent banner; updates consent mode based on user choice)
    if (cookiebotId) {
      const cb = document.createElement('script');
      cb.id = 'Cookiebot';
      cb.src = 'https://consent.cookiebot.com/uc.js';
      cb.setAttribute('data-cbid', cookiebotId);
      cb.setAttribute('data-blockingmode', 'auto');
      cb.type = 'text/javascript';
      document.head.appendChild(cb);
    }

    // 3. GA4 tag
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(gtagScript);

    gtag.call(null, 'js', new Date());
    gtag.call(null, 'config', measurementId, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    });
  }, [measurementId, cookiebotId, noConsentMode]);

  return null;
}
