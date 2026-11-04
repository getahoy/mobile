import { useCallback, useState } from "react";

export function useCarouselTouch() {
  const [touching, setTouching] = useState(false);
  const [released, setReleased] = useState(false);

  const touchStarted = useCallback(() => setTouching(true), []);
  const touchEnded = useCallback(() => {
    setTouching(false);
    setReleased(true);
  }, []);
  const resumed = useCallback(() => setReleased(false), []);

  return { touching, released, touchStarted, touchEnded, resumed };
}
