import type { ComponentProps } from "react";
import { Image } from "react-native";
import Animated from "react-native-reanimated";
import { useUniwind } from "uniwind";
import type { ResolvedTheme } from "@/features/appearance/appearanceChoice";

const lightMark = require("../../../../assets/images/splashWordmark.png");
const darkMark = require("../../../../assets/images/splashWordmarkDark.png");

type WordmarkProps = {
  style?: ComponentProps<typeof Animated.View>["style"];
  theme?: ResolvedTheme;
};

// The native splash image itself, at its imageWidth from app.config.ts and centred on
// the full screen like the splash, so every launch screen shows the same Ahoy.
export function Wordmark({ style, theme: shownTheme }: WordmarkProps) {
  const { theme: appTheme } = useUniwind();
  const theme = shownTheme ?? appTheme;
  return (
    <Animated.View
      style={style}
      aria-hidden
      pointerEvents="none"
      className="absolute inset-0 items-center justify-center"
    >
      <Image
        source={theme === "dark" ? darkMark : lightMark}
        resizeMode="contain"
        className="h-splash-mark-y w-splash-mark-x"
      />
    </Animated.View>
  );
}
