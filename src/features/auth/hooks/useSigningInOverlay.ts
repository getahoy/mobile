import { type AuthRequestState, authCopy } from "@getahoy/lib";
import { useState } from "react";
import { useElapsedOver } from "@/lib/useElapsedOver";
import { useSpinnerVisible } from "@/lib/useSpinnerVisible";

const SLOW_AFTER_MS = 6000;

type AuthSource = "credentials" | "google";

// A cancelled Google attempt keeps running inside the shared request hook, so
// its pending flag and any late error are masked until the next attempt starts.
export function useSigningInOverlay(authRequest: AuthRequestState) {
  const [source, setSource] = useState<AuthSource>("credentials");
  const [cancelled, setCancelled] = useState(false);
  const pending = authRequest.pending && !cancelled;
  const waiting = pending && source === "google";
  const visible = useSpinnerVisible(waiting);
  const slow = useElapsedOver(waiting, SLOW_AFTER_MS);
  const errorMessage = cancelled
    ? authCopy["error.social"]
    : authRequest.errorMessage;

  const track = (next: AuthSource) => {
    setSource(next);
    setCancelled(false);
  };
  return {
    source,
    pending,
    errorMessage,
    visible,
    slow,
    track,
    cancel: () => setCancelled(true),
  };
}
