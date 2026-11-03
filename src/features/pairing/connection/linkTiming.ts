import type { MacLinkState } from "./macLinkState.ts";

export const BACKGROUND_GRACE_MS = 20_000;
const PROBE_TIMEOUT_MS = 500;
const AUTO_RETRY_MS = 5000;
const QUICK_RETRY_MS = [300, 1000, 2000] as const;

// A dial missed right after unlock is usually wifi waking up, so the first
// retries come fast; a Mac that said it is off or asleep gets the slow pace.
export function retryDelay(kind: MacLinkState["kind"], misses: number): number {
  if (kind !== "unreachable") return AUTO_RETRY_MS;
  return QUICK_RETRY_MS[misses] ?? AUTO_RETRY_MS;
}

type ProbedSession = { probe: (timeoutMs: number) => Promise<boolean> };

export async function resumeLink(
  session: ProbedSession | null,
  reconnect: () => void,
): Promise<void> {
  if (session && (await session.probe(PROBE_TIMEOUT_MS))) return;
  reconnect();
}
