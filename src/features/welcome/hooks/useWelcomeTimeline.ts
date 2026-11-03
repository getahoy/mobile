import { useEffect, useState } from "react";
import {
  cancelAnimation,
  Easing,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useReducedMotion } from "@/lib/motion";
import { holdLeftMs } from "../launchTiming";
import { welcomeTimeline } from "../welcomeTimeline";

const { endMs } = welcomeTimeline;

// The timeline starts from the splash mark after the launch hold; reduced motion
// keeps the hold and then cuts straight to the end state.
export function useWelcomeTimeline() {
  const reducedMotion = useReducedMotion();
  const time = useSharedValue(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const holdMs = holdLeftMs(Date.now());
    const runMs = reducedMotion ? 0 : endMs;
    const run = withTiming(endMs, { duration: runMs, easing: Easing.linear });
    time.value = withDelay(holdMs, run);
    const timer = setTimeout(() => setDone(true), holdMs + runMs);
    return () => clearTimeout(timer);
  }, [done, reducedMotion, time]);

  const skip = () => {
    cancelAnimation(time);
    time.value = endMs;
    setDone(true);
  };

  return { time, done, skip };
}
