import { useElapsedOver } from "@/lib/useElapsedOver";
import { useSpinnerVisible } from "@/lib/useSpinnerVisible";
import { authClient } from "../client/authClient";
import { useSplashHold } from "./useSplashHold";

const SESSION_WAIT_LIMIT_MS = 6000;

type SessionGate = "waiting" | "signingIn" | "ready";

export function useSessionGate() {
  const { data: session, isPending } = authClient.useSession();
  const gaveUp = useElapsedOver(isPending, SESSION_WAIT_LIMIT_MS);
  const waiting = isPending && !gaveUp;
  const showSigningIn = useSpinnerVisible(waiting);
  useSplashHold(!waiting);

  return {
    gate: gateOf(waiting, showSigningIn),
    signedIn: Boolean(session),
  };
}

function gateOf(waiting: boolean, showSigningIn: boolean): SessionGate {
  if (showSigningIn) return "signingIn";
  if (waiting) return "waiting";
  return "ready";
}
