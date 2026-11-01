import { cva } from "class-variance-authority";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { duration } from "@/lib/motion";
import { permissionCopy } from "../copy/permissionCopy";
import type { PermissionKind } from "../permissionKind";

const NOTICE_MS = 1800;

const pill = cva(
  "h-8 flex-row items-center gap-2 self-center rounded-full px-3.5",
  {
    variants: {
      look: { home: "bg-linen", scanner: "bg-scrim-pill" },
    },
  },
);

const dot = cva("size-1.75 rounded-full", {
  variants: { look: { home: "bg-kelp", scanner: "bg-on-scrim-kelp" } },
});

const label = cva("font-sans-medium", {
  variants: { look: { home: "text-ink", scanner: "text-on-scrim" } },
});

type TurnedOnPillProps = {
  kind: PermissionKind;
  look: "home" | "scanner";
  onHidden: () => void;
};

export function TurnedOnPill({ kind, look, onHidden }: TurnedOnPillProps) {
  const hide = useRef(onHidden);

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
      className={pill({ look })}
    >
      <View className={dot({ look })} />
      <Text variant="footnote" className={label({ look })}>
        {permissionCopy.isOn(kind)}
      </Text>
    </Animated.View>
  );
}
