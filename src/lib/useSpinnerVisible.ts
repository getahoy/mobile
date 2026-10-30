import { useEffect, useRef, useState } from "react";
import { spinnerTiming } from "./motion";

export function useSpinnerVisible(busy: boolean): boolean {
  const [visible, setVisible] = useState(false);
  const shownAt = useRef(0);

  useEffect(() => {
    if (busy && !visible) {
      const show = () => {
        shownAt.current = Date.now();
        setVisible(true);
      };
      const timer = setTimeout(show, spinnerTiming.showAfterMs);
      return () => clearTimeout(timer);
    }
    if (!busy && visible) {
      const shownFor = Date.now() - shownAt.current;
      const left = Math.max(0, spinnerTiming.minimumVisibleMs - shownFor);
      const timer = setTimeout(() => setVisible(false), left);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [busy, visible]);

  return visible;
}
