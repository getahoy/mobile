import "@/global.css";

import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { useUniwind } from "uniwind";
import { useNavigationTheme } from "@/features/theme/useNavigationTheme";

export default function RootLayout() {
  const { theme } = useUniwind();
  const navigationTheme = useNavigationTheme();

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack />
      <PortalHost />
    </ThemeProvider>
  );
}
