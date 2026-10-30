export type SessionGate = "waiting" | "signingIn" | "ready";

// Only the first session load may hold the app back. Later checks (app focus,
// sign-in refetches) flip isPending again, and leaving "ready" would unmount
// the navigator and drop the screen the user is on.
export function nextSessionGate(
  previous: SessionGate,
  waiting: boolean,
  showSigningIn: boolean,
): SessionGate {
  if (previous === "ready") return "ready";
  if (showSigningIn) return "signingIn";
  if (waiting) return "waiting";
  return "ready";
}
