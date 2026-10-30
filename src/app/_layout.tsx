import "@/features/pairing/crypto/randomValues";
import "@/global.css";

import { authCopy } from "@getahoy/lib";
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
import { authClient } from "@/features/auth/client/authClient";
import { SessionLoading } from "@/features/auth/components/sessionLoading";
import { useSplashHold } from "@/features/auth/hooks/useSplashHold";
import { useGalleryMenuItem } from "@/features/devGallery/hooks/useGalleryMenuItem";
import { LiveMacLinksProvider } from "@/features/pairing/components/liveMacLinksProvider";

export { ErrorFallback as ErrorBoundary } from "@/features/errors/components/errorFallback";

export default function RootLayout() {
  const { theme } = useUniwind();
  const { data: session, isPending } = authClient.useSession();
  const signedIn = Boolean(session);
  useSplashHold(!isPending);
  useGalleryMenuItem();

  return (
    <SafeAreaListener onChange={({ insets }) => Uniwind.updateInsets(insets)}>
      <GestureRoot className="flex-1">
        <LiveMacLinksProvider>
          <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
            <StatusBar style={theme === "dark" ? "light" : "dark"} />
            {isPending ? (
              <SessionLoading />
            ) : (
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Protected guard={signedIn} redirectTo="/welcome">
                  <Stack.Screen name="index" />
                  <Stack.Screen
                    name="pair"
                    options={{ presentation: "fullScreenModal" }}
                  />
                  <Stack.Screen
                    name="account"
                    options={{
                      headerShown: true,
                      title: authCopy["account.title"],
                    }}
                  />
                </Stack.Protected>
                <Stack.Protected guard={!signedIn}>
                  <Stack.Screen
                    name="welcome"
                    options={{ animation: "none" }}
                  />
                  <Stack.Screen name="sign-in" />
                  <Stack.Screen name="sign-up" />
                </Stack.Protected>
                <Stack.Protected guard={__DEV__}>
                  <Stack.Screen name="dev/components" />
                </Stack.Protected>
              </Stack>
            )}
            <PortalHost />
          </ThemeProvider>
        </LiveMacLinksProvider>
      </GestureRoot>
    </SafeAreaListener>
  );
}
