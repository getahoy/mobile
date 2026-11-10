import { useState } from "react";
import { Uniwind, useUniwind } from "uniwind";
import type { Appearance } from "../appearanceChoice";
import { readAppearance, writeAppearance } from "../storage/appearanceStorage";

// Uniwind.setTheme also sets Appearance.setColorScheme, so native views,
// alerts and the keyboard follow the same choice.
export function useAppearance() {
  const { theme: resolvedTheme } = useUniwind();
  const [theme, setChoice] = useState(readAppearance);
  const setTheme = (appearance: Appearance) => {
    writeAppearance(appearance);
    Uniwind.setTheme(appearance);
    setChoice(appearance);
  };
  return { theme, resolvedTheme, setTheme };
}
