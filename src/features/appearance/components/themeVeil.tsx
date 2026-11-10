import { type ReactNode, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/cn";
import { duration, easing, useReducedMotion } from "@/lib/motion";
import type { ResolvedTheme } from "../appearanceChoice";

const canvas: Record<ResolvedTheme, string> = {
  light: "bg-day",
  dark: "bg-night",
};

type ThemeVeilProps = {
  theme: ResolvedTheme;
  fading: boolean;
  onDone: () => void;
  children?: ReactNode;
};

// The previous theme's canvas laid over the app, fading out to reveal the new one.
export function ThemeVeil({ theme, fading, onDone, children }: ThemeVeilProps) {
  const reducedMotion = useReducedMotion();
  const shown = useSharedValue(1);

  useEffect(() => {
    if (!fading) return;
    const fadeMs = reducedMotion ? 0 : duration.base;
    shown.value = withTiming(0, { duration: fadeMs, easing: easing.inOut });
    const timer = setTimeout(onDone, fadeMs);
    return () => clearTimeout(timer);
  }, [fading, onDone, reducedMotion, shown]);

  const fade = useAnimatedStyle(() => ({ opacity: shown.value }));

  return (
    <Animated.View
      style={fade}
      pointerEvents="none"
      aria-hidden
      className={cn("absolute inset-0", canvas[theme])}
    >
      {children}
    </Animated.View>
  );
}
