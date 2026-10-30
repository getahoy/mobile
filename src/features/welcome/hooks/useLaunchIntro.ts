import { useCallback, useEffect, useState } from "react";

type IntroPhase = "pending" | "playing" | "done";

// The root layout lives for the whole launch, so the intro plays once per cold start and never on return from background.
export function useLaunchIntro(ready: boolean, signedIn: boolean) {
  const [phase, setPhase] = useState<IntroPhase>("pending");

  useEffect(() => {
    if (!ready || phase !== "pending") return;
    setPhase(signedIn ? "playing" : "done");
  }, [ready, signedIn, phase]);

  const finish = useCallback(() => setPhase("done"), []);
  return { playing: phase === "playing", finish };
}
