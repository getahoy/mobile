import { useEffect, useRef, useState } from "react";
import { hideAfterMs, spinnerTiming } from "./waitingTiming";

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
      const left = hideAfterMs(Date.now() - shownAt.current);
      const timer = setTimeout(() => setVisible(false), left);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [busy, visible]);

  return visible;
}
