import { Pressable, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { duration, easing } from "@/lib/motion";
import type { MacCardAction } from "../hooks/useMacCardActions";

type MacCardHelp = { label: string; onPress: () => void };

type MacMessageCardProps = {
  message: string;
  actions: readonly MacCardAction[];
  help: MacCardHelp | null;
};

const rise = FadeInDown.duration(duration.base).easing(easing.out);

export function MacMessageCard({
  message,
  actions,
  help,
}: MacMessageCardProps) {
  return (
    <Animated.View
      entering={rise}
      className="gap-3 rounded-card bg-paper px-5 py-4"
    >
      <Text
        variant="bodySmall"
        role="alert"
        accessibilityLiveRegion="polite"
        className="text-driftwood"
      >
        {message}
      </Text>
      {actions.length > 0 ? (
        <View className="flex-row gap-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              size="sm"
              variant={action.tone}
              onPress={action.onPress}
            >
              <Text>{action.label}</Text>
            </Button>
          ))}
        </View>
      ) : null}
      {help ? (
        <Pressable
          role="link"
          onPress={help.onPress}
          className="min-h-11 justify-center self-start"
        >
          <Text variant="footnote" className="text-driftwood underline">
            {help.label}
          </Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}
