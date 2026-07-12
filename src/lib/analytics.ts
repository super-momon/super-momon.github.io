type AnalyticsValue = string | number | boolean | null;
type AnalyticsParams = Record<string, AnalyticsValue | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    __analyticsAutoLinkTrackingInitialized?: boolean;
  }
}

const MAX_PARAM_LENGTH = 120;

function sanitizeParams(params?: AnalyticsParams): Record<string, AnalyticsValue> | undefined {
  if (!params) return undefined;

  const sanitizedEntries = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return [key, value.slice(0, MAX_PARAM_LENGTH)] as const;
      }
      return [key, value ?? null] as const;
    });

  if (sanitizedEntries.length === 0) return undefined;
  return Object.fromEntries(sanitizedEntries);
}

export function trackEvent(eventName: string, params?: AnalyticsParams): void {
  if (typeof window === 'undefined') return;

  const safeParams = sanitizeParams(params);
  if (window.gtag) {
    window.gtag('event', eventName, safeParams);
    return;
  }

  if (window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...safeParams });
  }
}

export function trackPageView(path: string): void {
  if (typeof window === 'undefined') return;

  trackEvent('page_view', {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
  });
}

function getLinkLabel(link: HTMLAnchorElement): string {
  const explicitLabel = link.getAttribute('aria-label')?.trim();
  if (explicitLabel) return explicitLabel;

  const text = link.textContent?.replace(/\s+/g, ' ').trim();
  if (text) return text;

  return link.getAttribute('href') || 'unknown';
}

function getLinkEventName(link: HTMLAnchorElement, url: URL): string {
  if (link.hasAttribute('download')) return 'file_download_click';
  if (url.protocol === 'mailto:') return 'contact_email_click';
  if (url.protocol === 'tel:') return 'contact_phone_click';
  return url.origin !== window.location.origin ? 'outbound_link_click' : 'link_click';
}

export function initializeAutoLinkTracking(): void {
  if (typeof window === 'undefined') return;
  if (window.__analyticsAutoLinkTrackingInitialized) return;

  const clickHandler = (event: MouseEvent) => {
    const target = event.target as Element | null;
    if (!target) return;

    const link = target.closest('a');
    if (!(link instanceof HTMLAnchorElement)) return;
    if (link.hasAttribute('data-analytics-skip-auto')) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('javascript:')) return;

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(href, window.location.origin);
    } catch {
      return;
    }

    const sectionId = link.closest('[id]')?.id || 'unknown';
    const eventName = getLinkEventName(link, parsedUrl);

    trackEvent(eventName, {
      href: parsedUrl.toString(),
      link_text: getLinkLabel(link),
      section_id: sectionId,
      page_path: window.location.pathname,
    });
  };

  window.addEventListener('click', clickHandler, true);
  window.__analyticsAutoLinkTrackingInitialized = true;
}

