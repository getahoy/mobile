import { authCopy } from "@getahoy/lib";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import { Orb } from "@/components/ui/orb";
import { Text } from "@/components/ui/text";
import { Wordmark } from "@/features/welcome/components/wordmark";
import { duration } from "@/lib/motion";

type SigningInProps = { slow: boolean; onCancel?: () => void };

export function SigningIn({ slow, onCancel }: SigningInProps) {
  return (
    <Animated.View
      exiting={FadeOut.duration(duration.base)}
      aria-busy
      className="absolute inset-0 bg-sailcloth"
    >
      <View
        aria-hidden
        className="absolute inset-x-0 top-21/50 -mt-8 h-16 items-center justify-center"
      >
        <Wordmark />
      </View>
      <View className="absolute inset-x-0 top-21/50 mt-13 items-center">
        <Orb motion="breathe" className="size-signing-orb opacity-90" />
      </View>
      <Animated.View
        key={slow ? "slow" : "main"}
        entering={FadeIn.duration(duration.base)}
        className="absolute inset-x-6 top-21/50 mt-49"
      >
        <Text
          variant="bodySmall"
          role="status"
          accessibilityLiveRegion="polite"
          className="text-center text-driftwood"
        >
          {authCopy[slow ? "session.slow" : "session.signingIn"]}
        </Text>
      </Animated.View>
      {slow && onCancel ? (
        <Animated.View
          entering={FadeIn.duration(duration.slow)}
          className="absolute inset-x-0 bottom-14 items-center"
        >
          <Button
            variant="outline"
            size="sm"
            className="h-11 px-6"
            onPress={onCancel}
          >
            <Text>{authCopy["session.cancel"]}</Text>
          </Button>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}
