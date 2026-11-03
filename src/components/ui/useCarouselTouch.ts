import { useCallback, useEffect, useState } from "react";

const TOUCH_HOLD_MS = 6000;

export function useCarouselTouch() {
  const [touching, setTouching] = useState(false);
  const [holds, setHolds] = useState(0);

  useEffect(() => {
    if (holds === 0) return;
    const timer = setTimeout(() => setHolds(0), TOUCH_HOLD_MS);
    return () => clearTimeout(timer);
  }, [holds]);

  const touchStarted = useCallback(() => setTouching(true), []);
  const touchEnded = useCallback(() => {
    setTouching(false);
    setHolds((count) => count + 1);
  }, []);

  return { untouched: !touching && holds === 0, touchStarted, touchEnded };
}
