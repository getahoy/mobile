import "@/features/pairing/crypto/randomValues";
import "@/global.css";

import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { useUniwind } from "uniwind";
import { authClient } from "@/features/auth/client/authClient";
import { SessionLoading } from "@/features/auth/components/sessionLoading";

export { ErrorFallback as ErrorBoundary } from "@/features/errors/components/errorFallback";

export default function RootLayout() {
  const { theme } = useUniwind();
  const { data: session, isPending } = authClient.useSession();
  const signedIn = Boolean(session);

  return (
    <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      {isPending ? (
        <SessionLoading />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={signedIn}>
            <Stack.Screen name="index" />
            <Stack.Screen name="pair" />
          </Stack.Protected>
          <Stack.Protected guard={!signedIn}>
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
          </Stack.Protected>
        </Stack>
      )}
      <PortalHost />
    </ThemeProvider>
  );
}
