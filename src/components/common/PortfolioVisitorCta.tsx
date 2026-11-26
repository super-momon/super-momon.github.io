"use client";

import { trackEvent } from "@/lib/analytics";
import {
  fetchPortfolioVisitorCount,
  recordPortfolioVisit,
} from "@/lib/portfolioVisitor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faHandPointer,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";

const SESSION_STORAGE_KEY = "portfolio-visitor-recorded";
const visitorCountFormatter = new Intl.NumberFormat("en-US");

let recordedDuringThisDocument = false;

function hasRecordedInSession(): boolean {
  if (recordedDuringThisDocument) return true;

  try {
    return window.sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
  } catch (error) {
    console.warn("[PortfolioVisitorCta] Session storage is unavailable.", error);
    return false;
  }
}

function markSessionAsRecorded(): void {
  recordedDuringThisDocument = true;

  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
  } catch (error) {
    console.warn("[PortfolioVisitorCta] Could not persist the session marker.", error);
  }
}

export default function PortfolioVisitorCta() {
  const [currentCount, setCurrentCount] = useState<number | null>(null);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasDismissedPrompt, setHasDismissedPrompt] = useState(false);
  const requestInFlightRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const sessionAlreadyRecorded = hasRecordedInSession();

    fetchPortfolioVisitorCount(controller.signal)
      .then(({ currentCount: count }) => {
        setCurrentCount(count);
        setErrorMessage(null);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("[PortfolioVisitorCta] Could not load the visitor count.", error);
        setErrorMessage(
          sessionAlreadyRecorded
            ? "Visitor count unavailable. Your visit is already recorded for this session."
            : "Visitor count unavailable. You can still try to mark your visit.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setHasRecorded(sessionAlreadyRecorded);
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (isLoading || isSaving || hasRecorded || errorMessage) return;

    const timeoutId = window.setTimeout(() => setHasDismissedPrompt(true), 8000);
    return () => window.clearTimeout(timeoutId);
  }, [errorMessage, hasRecorded, isLoading, isSaving]);

  const handleVisit = async () => {
    if (
      isLoading
      || hasRecorded
      || requestInFlightRef.current
    ) {
      return;
    }

    requestInFlightRef.current = true;
    setHasDismissedPrompt(true);
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const { currentCount: nextCount } = await recordPortfolioVisit();
      markSessionAsRecorded();
      setHasRecorded(true);
      setCurrentCount(nextCount);
      trackEvent("portfolio_visit_recorded", {
        visitor_count: nextCount,
      });
    } catch (error) {
      console.error("[PortfolioVisitorCta] Could not record the visit.", error);
      setErrorMessage("Your visit could not be recorded. Please try again.");
    } finally {
      requestInFlightRef.current = false;
      setIsSaving(false);
    }
  };

  const countLabel = currentCount === null
    ? "Count unavailable"
    : `${visitorCountFormatter.format(currentCount)} ${currentCount === 1 ? "visit" : "visits"}`;
  const statusText = isLoading
    ? "Loading the portfolio visitor count."
    : isSaving
      ? "Recording your portfolio visit."
      : hasRecorded
        ? `Your visit is recorded. ${countLabel}.`
        : `${countLabel}. Select I was here to record your visit.`;
  const showVisitorPrompt = !isLoading
    && !isSaving
    && !hasRecorded
    && !errorMessage
    && !hasDismissedPrompt;

  return (
    <div className="pointer-events-none fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2 sm:right-6 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]">
      {showVisitorPrompt && (
        <div
          id="portfolio-visitor-prompt"
          className="relative max-w-52 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-xs leading-relaxed text-[var(--color-foreground)] shadow-lg shadow-black/15 sm:max-w-72 sm:px-4 sm:py-3 sm:text-sm"
        >
          Thanks for stopping by. Let me know you visited by tapping <strong>I was here</strong>.
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 right-8 h-3 w-3 rotate-45 border-b border-r border-[var(--color-border)] bg-[var(--color-surface)]"
          />
        </div>
      )}

      {errorMessage && (
        <div
          id="portfolio-visitor-error"
          role="alert"
          className="design-elevated-control pointer-events-auto max-w-72 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 px-3.5 py-2.5 text-sm leading-relaxed text-[var(--color-foreground)] shadow-lg shadow-black/15 backdrop-blur-xl"
        >
          {errorMessage}
        </div>
      )}

      <button
        type="button"
        onClick={handleVisit}
        disabled={isLoading || isSaving || hasRecorded}
        aria-busy={isLoading || isSaving}
        aria-describedby={
          errorMessage
            ? "portfolio-visitor-error"
            : showVisitorPrompt
              ? "portfolio-visitor-prompt"
              : undefined
        }
        aria-label={hasRecorded
          ? `Your visit is recorded. ${countLabel}.`
          : `Mark my visit. ${countLabel}.`}
        className={`pointer-events-auto inline-flex min-h-12 max-w-full items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-semibold shadow-lg shadow-black/15 transition-[background-color,border-color,color,box-shadow,transform] duration-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
          hasRecorded
            ? "cursor-default border-[var(--color-border)] bg-[var(--color-surface)]/95 text-[var(--color-foreground)] backdrop-blur-xl"
            : "liquid-glass-action cursor-pointer border-transparent bg-accent text-[var(--color-accent-contrast)] hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-xl disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70"
        }`}
      >
        <FontAwesomeIcon
          icon={isLoading || isSaving
            ? faSpinner
            : hasRecorded
              ? faCheck
              : faHandPointer}
          className={isLoading || isSaving ? "animate-spin motion-reduce:animate-none" : undefined}
          aria-hidden="true"
        />

        <span className="whitespace-nowrap">
          {isLoading
            ? "Loading visits"
            : isSaving
              ? "Recording visit"
              : hasRecorded
                ? "Thanks for visiting"
                : "I was here"}
        </span>

        {!isLoading && (
          <>
            <span
              aria-hidden="true"
              className="h-4 w-px bg-current opacity-30"
            />
            <span className="whitespace-nowrap font-mono text-xs tabular-nums">
              {countLabel}
            </span>
          </>
        )}
      </button>

      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {statusText}
      </span>
    </div>
  );
}
