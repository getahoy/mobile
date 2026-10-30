import { useRef } from "react";
import { useElapsedOver } from "@/lib/useElapsedOver";
import { useSpinnerVisible } from "@/lib/useSpinnerVisible";
import { authClient } from "../client/authClient";
import { nextSessionGate, type SessionGate } from "../sessionGate";
import { useSplashHold } from "./useSplashHold";

const SESSION_WAIT_LIMIT_MS = 6000;

export function useSessionGate() {
  const { data: session, isPending } = authClient.useSession();
  const gate = useRef<SessionGate>("waiting");
  const gaveUp = useElapsedOver(isPending, SESSION_WAIT_LIMIT_MS);
  const waiting = gate.current !== "ready" && isPending && !gaveUp;
  const showSigningIn = useSpinnerVisible(waiting);
  gate.current = nextSessionGate(gate.current, waiting, showSigningIn);
  useSplashHold(!waiting);
  return { gate: gate.current, signedIn: Boolean(session) };
}
