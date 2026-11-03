import { useCallback, useEffect, useRef, useState } from "react";

const TOUCH_HOLD_MS = 8000;

export function useCarouselTouch() {
  const touchingNow = useRef(false);
  const movedByUser = useRef(false);
  const [touching, setTouching] = useState(false);
  const [holds, setHolds] = useState(0);

  useEffect(() => {
    if (holds === 0) return;
    const timer = setTimeout(() => setHolds(0), TOUCH_HOLD_MS);
    return () => clearTimeout(timer);
  }, [holds]);

  const touchStarted = useCallback(() => {
    touchingNow.current = true;
    setTouching(true);
  }, []);
  const touchEnded = useCallback(() => {
    touchingNow.current = false;
    setTouching(false);
    setHolds((count) => count + 1);
  }, []);
  const movingStarted = useCallback(() => {
    if (touchingNow.current) movedByUser.current = true;
  }, []);
  const movedByAction = () => {
    movedByUser.current = true;
    setHolds((count) => count + 1);
  };
  const takeMovedByUser = () => {
    const moved = movedByUser.current;
    movedByUser.current = false;
    return moved;
  };

  return {
    untouched: !touching && holds === 0,
    touchStarted,
    touchEnded,
    movingStarted,
    movedByAction,
    takeMovedByUser,
  };
}
