import { hide, preventAutoHideAsync, setOptions } from "expo-splash-screen";
import { useEffect } from "react";
import { duration } from "@/lib/motion";

const SPLASH_LIMIT_MS = 3000;

void preventAutoHideAsync().catch(() => undefined);
setOptions({ fade: true, duration: duration.base });

export function useSplashHold(ready: boolean): void {
  useEffect(() => {
    if (ready) {
      hide();
      return;
    }
    const timer = setTimeout(hide, SPLASH_LIMIT_MS);
    return () => clearTimeout(timer);
  }, [ready]);
}
