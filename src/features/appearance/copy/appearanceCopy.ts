import {
  type Appearance,
  appearanceCopy as baseAppearanceCopy,
  type ResolvedTheme,
} from "@getahoy/lib";
import { Platform } from "react-native";

const phone = Platform.OS === "ios" ? "iPhone" : "phone";

export const appearanceCopy = {
  ...baseAppearanceCopy,
  caption: (choice: Appearance, resolved: ResolvedTheme) =>
    choice === "system"
      ? `System matches your ${phone}, now ${resolved}. It changes when your ${phone} does.`
      : `Ahoy stays ${choice}, whatever your ${phone} is set to.`,
} as const;
