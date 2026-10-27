import { useEffect } from "react";
import { View } from "react-native";
import {
  GestureDetector,
  useManualGesture,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Icon } from "@/features/pairing/components/icon";
import { talkCopy } from "../copy/talkCopy";
import { ThinkingRing } from "./thinkingRing";
import { VoiceRings } from "./voiceRings";

const MIC_ICON_SIZE = 40;
const HELD_SCALE = 1.08;

type TalkButtonProps = {
  macName: string;
  disabled: boolean;
  listening: boolean;
  thinking: boolean;
  level: number;
  onStart: () => void;
  onStop: () => void;
  onInterrupted: () => void;
};

export function TalkButton(props: TalkButtonProps) {
  const { macName, disabled, listening, thinking, level } = props;
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const hold = useManualGesture({
    enabled: !disabled,
    runOnJS: true,
    onTouchesDown: () => props.onStart(),
    onTouchesUp: () => props.onStop(),
    onTouchesCancel: () => props.onInterrupted(),
  });

  useEffect(() => {
    const grown = listening && !reducedMotion ? HELD_SCALE : 1;
    scale.value = withTiming(grown);
  }, [listening, reducedMotion, scale]);

  const grow = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const tone = listening ? "bg-destructive" : "bg-primary";

  return (
    <GestureDetector gesture={hold}>
      <View
        accessible
        accessibilityRole="button"
        accessibilityLabel={talkCopy.buttonLabel(macName)}
        accessibilityHint={talkCopy.buttonHint}
        accessibilityState={{ disabled, busy: listening || thinking }}
        className="size-talk-zone items-center justify-center self-center"
      >
        <VoiceRings level={level} active={listening} />
        <ThinkingRing active={thinking} />
        <Animated.View
          style={grow}
          className={`size-talk-button items-center justify-center rounded-full ${tone} ${disabled ? "opacity-40" : ""}`}
        >
          <Icon
            name={listening ? "mic" : "mic-outline"}
            size={MIC_ICON_SIZE}
            colorClassName="accent-primary-foreground"
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
