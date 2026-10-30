import { Pressable } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { timelinePhase } from "@/lib/motion";
import { welcomeCopy } from "../copy/welcomeCopy";
import { welcomeTimeline } from "../welcomeTimeline";

const { delayMs, durationMs } = welcomeTimeline.buttons;

type WelcomeActionsProps = {
  time: SharedValue<number>;
  onGetStarted: () => void;
  onHaveAccount: () => void;
};

export function WelcomeActions(props: WelcomeActionsProps) {
  const { time, onGetStarted, onHaveAccount } = props;
  const appear = useAnimatedStyle(() => ({
    opacity: timelinePhase(time.value, delayMs, durationMs),
  }));
  return (
    <Animated.View
      style={appear}
      className="absolute inset-x-5 bottom-10.5 gap-1.5"
    >
      <Button onPress={onGetStarted}>
        <Text>{welcomeCopy.getStarted}</Text>
      </Button>
      <Pressable
        role="button"
        onPress={onHaveAccount}
        className="h-11 items-center justify-center"
      >
        <Text variant="bodySmall" className="text-driftwood">
          {welcomeCopy.haveAccount}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
