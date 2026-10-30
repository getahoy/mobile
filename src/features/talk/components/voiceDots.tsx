import { useEffect } from "react";
import { View } from "react-native";
import {
  cancelAnimation,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { easing, useReducedMotion } from "@/lib/motion";
import type { DotsMode } from "../voiceActivity";
import { VoiceDot } from "./voiceDot";

const DOT_WEIGHTS = [0.55, 1, 0.8, 0.45] as const;
const PULSE_LEVEL = 0.35;
const PULSE_HALF_CYCLE_MS = 700;
const LEVEL_EASE_MS = 100;
const FOREVER = -1;

type VoiceDotsProps = { mode: Exclude<DotsMode, "off">; level: number };

export function VoiceDots({ mode, level }: VoiceDotsProps) {
  const reducedMotion = useReducedMotion();
  const shown = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(shown);
    if (reducedMotion) {
      shown.value = 0;
      return;
    }
    if (mode === "level") {
      shown.value = withTiming(level, { duration: LEVEL_EASE_MS });
      return;
    }
    const swell = withTiming(PULSE_LEVEL, {
      duration: PULSE_HALF_CYCLE_MS,
      easing: easing.inOut,
    });
    shown.value = withRepeat(swell, FOREVER, true);
  }, [mode, level, reducedMotion, shown]);

  return (
    <View aria-hidden className="h-6 flex-row items-center gap-1">
      {DOT_WEIGHTS.map((weight) => (
        <VoiceDot key={weight} level={shown} weight={weight} />
      ))}
    </View>
  );
}
