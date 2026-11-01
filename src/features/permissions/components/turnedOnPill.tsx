import { useEffect, useRef } from "react";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { duration } from "@/lib/motion";
import { permissionCopy } from "../copy/permissionCopy";
import type { PermissionKind } from "../permissionKind";

const NOTICE_MS = 1800;

const looks = {
  home: { pill: "bg-linen", dot: "bg-kelp", label: "text-ink" },
  scanner: {
    pill: "bg-scrim-pill",
    dot: "bg-on-scrim-kelp",
    label: "text-on-scrim",
  },
} as const;

type TurnedOnPillProps = {
  kind: PermissionKind;
  look: keyof typeof looks;
  onHidden: () => void;
};

export function TurnedOnPill({ kind, look, onHidden }: TurnedOnPillProps) {
  const hide = useRef(onHidden);
  const colors = looks[look];

  useEffect(() => {
    hide.current = onHidden;
  });

  useEffect(() => {
    const timer = setTimeout(() => hide.current(), NOTICE_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      role="status"
      accessibilityLiveRegion="polite"
      entering={FadeIn.duration(duration.base)}
      exiting={FadeOut.duration(duration.base)}
      className={cn(
        "h-8 flex-row items-center gap-2 self-center rounded-full px-3.5",
        colors.pill,
      )}
    >
      <View className={cn("size-1.75 rounded-full", colors.dot)} />
      <Text variant="footnote" className={cn("font-sans-medium", colors.label)}>
        {permissionCopy.isOn(kind)}
      </Text>
    </Animated.View>
  );
}
