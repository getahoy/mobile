import { type AuthRequestState, authCopy } from "@getahoy/lib";
import { useState } from "react";
import { useElapsedOver } from "@/lib/useElapsedOver";
import { useSpinnerVisible } from "@/lib/useSpinnerVisible";

const SLOW_AFTER_MS = 6000;

export type AuthSource = "credentials" | "google";

export function useSigningInOverlay(authRequest: AuthRequestState) {
  const [source, setSource] = useState<AuthSource>("credentials");
  const [cancelled, setCancelled] = useState(false);
  const waiting = authRequest.pending && source === "google" && !cancelled;
  const visible = useSpinnerVisible(waiting);
  const slow = useElapsedOver(waiting, SLOW_AFTER_MS);

  const track = (next: AuthSource) => {
    setSource(next);
    setCancelled(false);
  };
  const cancel = () => {
    setCancelled(true);
    authRequest.showError(authCopy["error.social"]);
  };

  return { source, visible, slow, track, cancel };
}
