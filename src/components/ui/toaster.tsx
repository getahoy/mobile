import { Pressable, View } from "react-native";
import Animated, { Keyframe } from "react-native-reanimated";
import {
  duration,
  easing,
  REDUCED_FADE_MS,
  useReducedMotion,
} from "@/lib/motion";
import { Text } from "./text";
import { dismissToast, useShownToast } from "./toast";

const RISE_DISTANCE = 8;

const riseIn = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: RISE_DISTANCE }] },
  100: { opacity: 1, transform: [{ translateY: 0 }], easing: easing.out },
}).duration(duration.base);

const fadeIn = new Keyframe({
  0: { opacity: 0 },
  100: { opacity: 1 },
}).duration(REDUCED_FADE_MS);

const fadeOut = new Keyframe({
  0: { opacity: 1 },
  100: { opacity: 0 },
}).duration(duration.fast);

export function Toaster() {
  const shown = useShownToast();
  const reducedMotion = useReducedMotion();
  if (!shown) return null;
  const { action } = shown;
  const act = () => {
    action?.onAction();
    dismissToast();
  };
  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 bottom-safe-offset-6 items-center"
    >
      <Animated.View
        key={shown.id}
        entering={reducedMotion ? fadeIn : riseIn}
        exiting={fadeOut}
        className="h-11 flex-row items-center gap-2.5 rounded-full bg-ink pr-1.5 pl-4.5"
      >
        <Text variant="bodySmall" className="font-sans-medium text-on-ink">
          {shown.text}
        </Text>
        {action ? (
          <Pressable
            role="button"
            onPress={act}
            className="h-8 justify-center rounded-full px-3 active:opacity-80"
          >
            <Text
              variant="bodySmall"
              className="font-sans-medium text-on-ink underline"
            >
              {action.label}
            </Text>
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}
