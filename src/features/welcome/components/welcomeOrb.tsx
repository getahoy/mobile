import { View } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Orb } from "@/components/ui/orb";
import { timelinePhase } from "@/lib/motion";
import { welcomeTimeline } from "../welcomeTimeline";

const { delayMs, durationMs, riseFrom, scaleFrom } = welcomeTimeline.orbRise;

type WelcomeOrbProps = { time: SharedValue<number> };

export function WelcomeOrb({ time }: WelcomeOrbProps) {
  const rise = useAnimatedStyle(() => {
    const risen = timelinePhase(time.value, delayMs, durationMs);
    return {
      opacity: risen,
      transform: [
        { translateY: riseFrom * (1 - risen) },
        { scale: scaleFrom + (1 - scaleFrom) * risen },
      ],
    };
  });
  return (
    <View
      pointerEvents="none"
      className="absolute inset-x-0 bottom-42.5 items-center"
    >
      <Animated.View style={rise}>
        <Orb motion="breathe" className="size-welcome-orb" />
      </Animated.View>
    </View>
  );
}
