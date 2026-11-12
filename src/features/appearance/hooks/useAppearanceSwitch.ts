import type { Appearance } from "@getahoy/lib";
import { useRef, useState } from "react";
import { haptic } from "@/lib/haptics";
import { useReducedMotion } from "@/lib/motion";
import { useAppearance } from "./useAppearance";

const CROSSFADE_DELAY_MS = 60;

// The selection moves at once; the theme follows a beat later so the tap reads first.
export function useAppearanceSwitch() {
  const { theme, resolvedTheme, setTheme } = useAppearance();
  const reducedMotion = useReducedMotion();
  const [chosen, setChosen] = useState(theme);
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);

  const choose = (appearance: Appearance) => {
    if (appearance === chosen) return;
    haptic("optionSelected");
    setChosen(appearance);
    if (pending.current) clearTimeout(pending.current);
    if (reducedMotion) {
      setTheme(appearance);
      return;
    }
    pending.current = setTimeout(
      () => setTheme(appearance),
      CROSSFADE_DELAY_MS,
    );
  };

  return { chosen, applied: theme, resolved: resolvedTheme, choose };
}
