import { Appearance } from "react-native";
import { Uniwind } from "uniwind";
import type { ResolvedTheme } from "./appearanceChoice";
import { readAppearance } from "./storage/appearanceStorage";

// Read before setTheme overrides it: the splash was drawn in this theme.
const launchSystemTheme: ResolvedTheme =
  Appearance.getColorScheme() === "dark" ? "dark" : "light";

const launchChoice = readAppearance();
Uniwind.setTheme(launchChoice);

export const launchVeilTheme: ResolvedTheme | null =
  launchChoice === "system" || launchChoice === launchSystemTheme
    ? null
    : launchSystemTheme;
