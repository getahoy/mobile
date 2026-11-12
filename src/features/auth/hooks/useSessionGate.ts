import { spinnerTiming, useElapsedOver, useSpinnerVisible } from "@getahoy/lib";
import { useRef } from "react";
import { authClient } from "../client/authClient";
import {
  type GateInput,
  launchSignedIn,
  nextSessionGate,
  orphanedSession,
  type SessionGate,
  sessionFailure,
  sessionReady,
} from "../sessionGate";
import { useLaunchCookie } from "./useLaunchCookie";
import { SPLASH_LIMIT_MS, useSplashHold } from "./useSplashHold";

const SESSION_WAIT_LIMIT_MS = 6000;
const SIGNING_IN_DELAY_MS = SPLASH_LIMIT_MS - spinnerTiming.showAfterMs;

export function useSessionGate() {
  const { data: session, isPending, error } = authClient.useSession();
  const cookie = useLaunchCookie();
  const gate = useRef<SessionGate>("waiting");
  const gaveUp = useElapsedOver(
    gate.current !== "ready",
    SESSION_WAIT_LIMIT_MS,
  );
  const input: GateInput = {
    cookie,
    hasSession: session !== null,
    isPending,
    failure: sessionFailure(error),
    gaveUp,
    showSigningIn: false,
  };
  const waiting = gate.current !== "ready" && !sessionReady(input);
  const slow = useElapsedOver(waiting, SIGNING_IN_DELAY_MS);
  const showSigningIn = useSpinnerVisible(slow);
  gate.current = nextSessionGate(gate.current, { ...input, showSigningIn });
  useSplashHold(!waiting);
  return {
    gate: gate.current,
    signedIn: launchSignedIn(input),
    stale: { failure: input.failure, orphaned: orphanedSession(input) },
  };
}
