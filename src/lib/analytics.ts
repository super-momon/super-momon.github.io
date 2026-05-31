export function trackEvent(
  eventName: string,
  params: Record<string, string>
): void {
  window.gtag?.("event", eventName, params);
}
