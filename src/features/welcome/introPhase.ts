export type IntroPhase = "pending" | "playing" | "done";

export function latchIntro(
  phase: IntroPhase,
  ready: boolean,
  signedIn: boolean,
): IntroPhase {
  if (phase !== "pending" || !ready) return phase;
  return signedIn ? "playing" : "done";
}
