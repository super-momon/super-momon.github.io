export function trackEvent(
  eventName: string,
  params?: Record<string, any>
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

