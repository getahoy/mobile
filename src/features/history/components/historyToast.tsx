import { Pressable, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { duration } from "@/lib/motion";
import { historyCopy } from "../copy/historyCopy";
import type { Toast } from "../hooks/useToast";

type HistoryToastProps = { toast: Toast | null; onUndo: () => void };

export function HistoryToast({ toast, onUndo }: HistoryToastProps) {
  if (!toast) return null;
  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 bottom-safe-offset-6 items-center"
    >
      <Animated.View
        entering={FadeIn.duration(duration.base)}
        exiting={FadeOut.duration(duration.fast)}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        className="h-11 flex-row items-center gap-2.5 rounded-full bg-ink pr-1.5 pl-4.5"
      >
        <Text variant="bodySmall" className="font-sans-medium text-on-ink">
          {toast.text}
        </Text>
        {toast.undo ? (
          <Pressable
            role="button"
            onPress={onUndo}
            className="h-8 justify-center rounded-full px-3 active:opacity-80"
          >
            <Text
              variant="bodySmall"
              className="font-sans-medium text-on-ink underline"
            >
              {historyCopy.undo}
            </Text>
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}
