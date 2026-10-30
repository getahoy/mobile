import * as SwitchPrimitives from "@rn-primitives/switch";
import { type ComponentProps, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/cn";
import { duration, easing } from "@/lib/motion";

const THUMB_TRAVEL = 20;
const TAP_TARGET_PADDING = 6;

type SwitchProps = ComponentProps<typeof SwitchPrimitives.Root>;

export function Switch({
  className,
  checked,
  disabled,
  ...props
}: SwitchProps) {
  const offset = useSharedValue(checked ? THUMB_TRAVEL : 0);

  useEffect(() => {
    offset.value = withTiming(checked ? THUMB_TRAVEL : 0, {
      duration: duration.fast,
      easing: easing.out,
    });
  }, [checked, offset]);

  const slide = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <SwitchPrimitives.Root
      checked={checked}
      {...(disabled === undefined ? {} : { disabled })}
      hitSlop={TAP_TARGET_PADDING}
      className={cn(
        "h-8 w-13 shrink-0 flex-row items-center rounded-full p-0.5",
        checked ? "bg-kelp" : "bg-rope",
        disabled && "opacity-40",
        className,
      )}
      {...props}
    >
      <Animated.View style={slide} className="size-7 rounded-full bg-white" />
    </SwitchPrimitives.Root>
  );
}
