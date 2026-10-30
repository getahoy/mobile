import { useEffect, useState } from "react";
import {
  cancelAnimation,
  Easing,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useReducedMotion } from "@/lib/motion";
import { welcomeTimeline } from "../welcomeTimeline";

const { endMs } = welcomeTimeline;

export function useWelcomeTimeline() {
  const reducedMotion = useReducedMotion();
  const time = useSharedValue(reducedMotion ? endMs : 0);
  const [done, setDone] = useState(reducedMotion);

  useEffect(() => {
    if (done) return;
    time.value = withTiming(endMs, { duration: endMs, easing: Easing.linear });
    const timer = setTimeout(() => setDone(true), endMs);
    return () => clearTimeout(timer);
  }, [done, time]);

  const skip = () => {
    cancelAnimation(time);
    time.value = endMs;
    setDone(true);
  };

  return { time, done, skip };
}
