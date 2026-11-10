import { hide, preventAutoHideAsync, setOptions } from "expo-splash-screen";
import { useEffect } from "react";

export const SPLASH_LIMIT_MS = 3000;

void preventAutoHideAsync().catch(() => undefined);
setOptions({ fade: false });

// The first JS frame draws the same image in the same place, so the splash is cut, not
// faded, after one frame has painted; a crossfade would show both marks at once.
const hideAfterPaint = () => requestAnimationFrame(() => hide());

export function useSplashHold(ready: boolean): void {
  useEffect(() => {
    if (ready) {
      hideAfterPaint();
      return;
    }
    const timer = setTimeout(hideAfterPaint, SPLASH_LIMIT_MS);
    return () => clearTimeout(timer);
  }, [ready]);
}
