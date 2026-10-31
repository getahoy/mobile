import { useCallback, useEffect, useRef } from "react";

const HOLD_REPEAT_MS = 200;

export function useHoldRepeat(stepOnce: () => boolean) {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const start = () => {
    stop();
    if (!stepOnce()) return;
    timer.current = setInterval(() => {
      if (!stepOnce()) stop();
    }, HOLD_REPEAT_MS);
  };

  return { onLongPress: start, onPressOut: stop };
}
