import { Pressable } from "react-native";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useHoldRepeat } from "../hooks/useHoldRepeat";

const HOLD_DELAY_MS = 300;

type ZoomStepButtonProps = {
  icon: IconName;
  label: string;
  disabled: boolean;
  onStep: () => boolean;
};

export function ZoomStepButton({
  icon,
  label,
  disabled,
  onStep,
}: ZoomStepButtonProps) {
  const hold = useHoldRepeat(onStep);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => onStep()}
      onLongPress={hold.onLongPress}
      onPressOut={hold.onPressOut}
      delayLongPress={HOLD_DELAY_MS}
      className={cn(
        "size-11 items-center justify-center rounded-full",
        disabled && "opacity-40",
      )}
    >
      <Icon name={icon} size="md" tintColorClassName="accent-on-scrim" />
    </Pressable>
  );
}
