import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/motion";
import {
  firstTryFrame,
  nextTryFrame,
  type TryFrame,
  wholeTryFrame,
} from "../tryLoop";

type TryLoopOptions = {
  examples: readonly string[];
  running: boolean;
  onAdvance: (index: number) => void;
};

export function useTryLoop({ examples, running, onAdvance }: TryLoopOptions) {
  const reduced = useReducedMotion();
  const [frame, setFrame] = useState(firstTryFrame);

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      const next = nextTryFrame(frame, examples);
      if (next.index !== frame.index) onAdvance(next.index);
      setFrame(next);
    }, frame.delayMs);
    return () => clearTimeout(timer);
  }, [running, frame, examples, onAdvance]);

  const showWhole = useCallback(
    (index: number) => setFrame(wholeTryFrame(index, examples)),
    [examples],
  );

  const shown: TryFrame = reduced
    ? wholeTryFrame(frame.index, examples)
    : frame;
  return { frame: shown, showWhole };
}
