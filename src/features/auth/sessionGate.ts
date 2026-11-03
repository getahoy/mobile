import type { LaunchCookie } from "./launchCookie.ts";

export type SessionGate = "waiting" | "signingIn" | "ready";

export type SessionFailure = "none" | "unauthorized" | "other";

const UNAUTHORIZED_STATUS = 401;

export function sessionFailure(
  error: { status?: number } | null,
): SessionFailure {
  if (error === null) return "none";
  return error.status === UNAUTHORIZED_STATUS ? "unauthorized" : "other";
}

export type GateInput = {
  cookie: LaunchCookie;
  hasSession: boolean;
  isPending: boolean;
  failure: SessionFailure;
  gaveUp: boolean;
  showSigningIn: boolean;
};

// The cached session is trusted only with a stored cookie, and a failed check
// without a session is not proof of signing out (offline, locked keychain).
export function sessionReady(input: GateInput): boolean {
  if (input.hasSession && input.cookie === "present") return true;
  if (input.cookie === "absent") return true;
  if (!input.isPending && (input.hasSession || input.failure !== "other")) {
    return true;
  }
  return input.gaveUp;
}

// Only cache hydration sets a session while the first check is pending, so a
// fresh sign-in later on never matches.
export function orphanedSession(
  input: Pick<GateInput, "cookie" | "hasSession" | "isPending">,
): boolean {
  return input.cookie === "absent" && input.hasSession && input.isPending;
}

export function launchSignedIn(
  input: Pick<GateInput, "cookie" | "hasSession" | "isPending">,
): boolean {
  if (!input.isPending) return input.hasSession;
  return input.hasSession && input.cookie !== "absent";
}

// Only the first session load may hold the app back. Later checks (app focus,
// reconnect, sign-in refetches) flip isPending again, and leaving "ready" would
// unmount the navigator and drop the screen the user is on.
export function nextSessionGate(
  previous: SessionGate,
  input: GateInput,
): SessionGate {
  if (previous === "ready") return "ready";
  if (sessionReady(input)) return "ready";
  if (input.showSigningIn) return "signingIn";
  return "waiting";
}
