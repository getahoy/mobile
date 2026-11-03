import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { useReducedMotion } from "@/lib/motion";
import {
  firstTryFrame,
  nextTryFrame,
  stillTryFrame,
  type TryFrame,
} from "../tryLoop";

function useAppActive(): boolean {
  const [active, setActive] = useState(AppState.currentState === "active");
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (appState) =>
      setActive(appState === "active"),
    );
    return () => subscription.remove();
  }, []);
  return active;
}

export function useTryLoop(
  examples: readonly string[],
  paused: boolean,
): TryFrame {
  const reduced = useReducedMotion();
  const active = useAppActive();
  const [frame, setFrame] = useState(firstTryFrame);
  const running = active && !paused && !reduced;

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(
      () => setFrame((current) => nextTryFrame(current, examples)),
      frame.delayMs,
    );
    return () => clearTimeout(timer);
  }, [running, frame, examples]);

  return reduced ? stillTryFrame(examples) : frame;
}
