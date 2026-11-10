import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind, useUniwind } from "uniwind";
import { GestureRoot } from "@/components/gestureRoot";
import { Toaster } from "@/components/ui/toaster";
import { AppearanceFade } from "@/features/appearance/components/appearanceFade";
import { useRootBackground } from "@/features/appearance/hooks/useRootBackground";
import { LiveMacLinksProvider } from "@/features/pairing/components/liveMacLinksProvider";
import { LaunchIntro } from "@/features/welcome/components/launchIntro";
import { useLaunchIntro } from "@/features/welcome/hooks/useLaunchIntro";
import { useClearCacheOnSignOut } from "../hooks/useClearCacheOnSignOut";
import { useClearStaleSession } from "../hooks/useClearStaleSession";
import { useSessionGate } from "../hooks/useSessionGate";
import { SigningIn } from "./signingIn";

export function SessionRoot() {
  const { theme } = useUniwind();
  const { gate, signedIn, stale } = useSessionGate();
  useRootBackground();
  useClearStaleSession(stale);
  useClearCacheOnSignOut(signedIn);
  const intro = useLaunchIntro(gate === "ready", signedIn);

  return (
    <SafeAreaListener onChange={({ insets }) => Uniwind.updateInsets(insets)}>
      <GestureRoot className="flex-1">
        <LiveMacLinksProvider>
          <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
            <StatusBar style={theme === "dark" ? "light" : "dark"} />
            {gate === "signingIn" ? <SigningIn slow={false} /> : null}
            {gate === "ready" ? (
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Protected guard={signedIn} redirectTo="/welcome">
                  <Stack.Screen name="index" />
                  <Stack.Screen
                    name="pair"
                    options={{ presentation: "fullScreenModal" }}
                  />
                  <Stack.Screen name="account" />
                  <Stack.Screen name="history" />
                  <Stack.Screen
                    name="microphone"
                    options={{ presentation: "fullScreenModal" }}
                  />
                  <Stack.Screen
                    name="local-network"
                    options={{ presentation: "fullScreenModal" }}
                  />
                </Stack.Protected>
                <Stack.Protected guard={!signedIn}>
                  <Stack.Screen
                    name="welcome"
                    options={{ animation: "fade" }}
                  />
                  <Stack.Screen name="sign-in" />
                  <Stack.Screen name="sign-up" />
                </Stack.Protected>
                <Stack.Protected guard={__DEV__}>
                  <Stack.Screen name="dev/components" />
                </Stack.Protected>
              </Stack>
            ) : null}
            {intro.playing ? <LaunchIntro onDone={intro.finish} /> : null}
            <PortalHost />
            <Toaster />
            <AppearanceFade />
          </ThemeProvider>
        </LiveMacLinksProvider>
      </GestureRoot>
    </SafeAreaListener>
  );
}
