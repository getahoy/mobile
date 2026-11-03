import { useEffect } from "react";
import { logger } from "@/features/logging/logger";
import { authClient } from "../client/authClient";
import { signOutOnce } from "../client/signOutOnce";
import type { SessionFailure } from "../sessionGate";

type StaleSession = { failure: SessionFailure; orphaned: boolean };

const logFailure = (error: unknown) =>
  logger.error("auth.session", "clearing a stale session failed", error);

// Both a 401 and a cached session without a cookie live on in SecureStore;
// signing out clears that copy so the next launch does not open Home again.
export function useClearStaleSession({ failure, orphaned }: StaleSession) {
  useEffect(() => {
    if (failure === "unauthorized") signOutOnce().catch(logFailure);
  }, [failure]);

  useEffect(() => {
    if (orphaned) authClient.signOut().catch(logFailure);
  }, [orphaned]);
}
