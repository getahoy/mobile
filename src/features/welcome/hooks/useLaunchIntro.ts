import { useCallback, useState } from "react";
import { type IntroPhase, latchIntro } from "../introPhase";

// The root layout lives for the whole launch, so the intro plays once per cold start and never on return from background.
// The phase latches during render, so the first ready frame is already covered by the intro.
export function useLaunchIntro(ready: boolean, signedIn: boolean) {
  const [phase, setPhase] = useState<IntroPhase>("pending");
  const latched = latchIntro(phase, ready, signedIn);
  if (latched !== phase) setPhase(latched);

  const finish = useCallback(() => setPhase("done"), []);
  return { playing: latched === "playing", finish };
}
