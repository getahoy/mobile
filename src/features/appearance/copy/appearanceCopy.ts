import { Platform } from "react-native";
import type { Appearance, ResolvedTheme } from "../appearanceChoice";

const phone = Platform.OS === "ios" ? "iPhone" : "phone";

export const appearanceCopy = {
  title: "Appearance",
  options: {
    system: "System",
    light: "Light",
    dark: "Dark",
  } satisfies Record<Appearance, string>,
  caption: (choice: Appearance, resolved: ResolvedTheme) =>
    choice === "system"
      ? `System matches your ${phone}, now ${resolved}. It changes when your ${phone} does.`
      : `Ahoy stays ${choice}, whatever your ${phone} is set to.`,
} as const;
