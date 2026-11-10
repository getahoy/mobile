import { useCallback, useState } from "react";
import { useUniwind } from "uniwind";
import { useReducedMotion } from "@/lib/motion";
import type { ResolvedTheme } from "../appearanceChoice";
import { ThemeVeil } from "./themeVeil";

type Fade = { from: ResolvedTheme; id: number };

// The veil is set during render, so the first frame in the new theme is already covered.
export function AppearanceFade() {
  const { theme } = useUniwind();
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(theme);
  const [fade, setFade] = useState<Fade | null>(null);
  if (theme !== shown) {
    setShown(theme);
    if (!reducedMotion) {
      setFade({ from: shown, id: Date.now() });
    }
  }
  const finish = useCallback(() => setFade(null), []);
  if (!fade) return null;
  return <ThemeVeil key={fade.id} theme={fade.from} fading onDone={finish} />;
}
