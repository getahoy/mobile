import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/cn";
import { duration, easing } from "@/lib/motion";
import type { ResolvedTheme } from "../appearanceChoice";

const canvas: Record<ResolvedTheme, string> = {
  light: "bg-day",
  dark: "bg-night",
};

type ThemeVeilProps = { theme: ResolvedTheme; onDone: () => void };

// The previous theme's canvas laid over the app, fading out to reveal the new one.
export function ThemeVeil({ theme, onDone }: ThemeVeilProps) {
  const shown = useSharedValue(1);

  useEffect(() => {
    shown.value = withTiming(0, {
      duration: duration.base,
      easing: easing.inOut,
    });
    const timer = setTimeout(onDone, duration.base);
    return () => clearTimeout(timer);
  }, [onDone, shown]);

  const fade = useAnimatedStyle(() => ({ opacity: shown.value }));

  return (
    <Animated.View
      style={fade}
      pointerEvents="none"
      aria-hidden
      className={cn("absolute inset-0", canvas[theme])}
    />
  );
}
