import { hide, preventAutoHideAsync, setOptions } from "expo-splash-screen";
import { useEffect, useState } from "react";

export const SPLASH_LIMIT_MS = 3000;

void preventAutoHideAsync().catch(() => undefined);
setOptions({ fade: false });

// The first JS frame draws the same image in the same place, so the splash is cut, not
// faded, after one frame has painted; a crossfade would show both marks at once.
const hideAfterPaint = (onHidden: () => void) =>
  requestAnimationFrame(() => {
    hide();
    onHidden();
  });

export function useSplashHold(ready: boolean): boolean {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const markHidden = () => setHidden(true);
    if (ready) {
      hideAfterPaint(markHidden);
      return;
    }
    const timer = setTimeout(() => hideAfterPaint(markHidden), SPLASH_LIMIT_MS);
    return () => clearTimeout(timer);
  }, [ready]);
  return hidden;
}
