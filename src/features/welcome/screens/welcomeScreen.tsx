import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { WelcomeActions } from "../components/welcomeActions";
import { WelcomeHeadline } from "../components/welcomeHeadline";
import { WelcomeOrb } from "../components/welcomeOrb";
import { WelcomeWordmark } from "../components/welcomeWordmark";
import { welcomeCopy } from "../copy/welcomeCopy";
import { useWelcomeTimeline } from "../hooks/useWelcomeTimeline";

export function WelcomeScreen() {
  const { time, done, skip } = useWelcomeTimeline();
  return (
    <View className="flex-1 bg-sailcloth">
      <WelcomeWordmark time={time} />
      <WelcomeOrb time={time} />
      <WelcomeHeadline time={time} />
      <WelcomeActions
        time={time}
        onGetStarted={() => router.push("/sign-up")}
        onHaveAccount={() => router.push("/sign-in")}
      />
      {done ? null : (
        <Pressable
          role="button"
          accessibilityLabel={welcomeCopy.skipIntro}
          onPress={skip}
          className="absolute inset-0"
        />
      )}
    </View>
  );
}
