import { supabase } from "./supabase";

export interface PortfolioVisitorCount {
  currentCount: number;
  lastVisitorDate: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePortfolioVisitorCount(value: unknown): PortfolioVisitorCount {
  if (!isRecord(value)) {
    throw new Error("The portfolio visitor response was not an object.");
  }

  const currentCount = value.current_count;
  const lastVisitorDate = value.last_visitor_date;

  if (
    typeof currentCount !== "number"
    || !Number.isSafeInteger(currentCount)
    || currentCount < 0
  ) {
    throw new Error("The portfolio visitor count was invalid.");
  }

  if (
    lastVisitorDate !== null
    && (typeof lastVisitorDate !== "string" || Number.isNaN(Date.parse(lastVisitorDate)))
  ) {
    throw new Error("The last portfolio visitor date was invalid.");
  }

  return {
    currentCount,
    lastVisitorDate,
  };
}

export async function fetchPortfolioVisitorCount(
  signal?: AbortSignal,
): Promise<PortfolioVisitorCount> {
  const request = supabase.rpc(
    "get_portfolio_visitor_count",
    undefined,
    { get: true },
  );
  const { data, error } = await (
    signal ? request.abortSignal(signal) : request
  );

  if (error) {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    throw new Error(`Unable to load the portfolio visitor count: ${error.message}`);
  }

  return parsePortfolioVisitorCount(data);
}

export async function recordPortfolioVisit(): Promise<PortfolioVisitorCount> {
  const { data, error } = await supabase.rpc(
    "increment_portfolio_visitor_count",
  );

  if (error) {
    throw new Error(`Unable to record the portfolio visit: ${error.message}`);
  }

  return parsePortfolioVisitorCount(data);
}
