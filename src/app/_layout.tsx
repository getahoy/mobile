import "@/global.css";

import { NAV_THEME } from "@/lib/theme";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { useUniwind } from "uniwind";

export default function RootLayout() {
  const { theme } = useUniwind();

  return (
    <ThemeProvider value={NAV_THEME[theme === "dark" ? "dark" : "light"]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack />
      <PortalHost />
    </ThemeProvider>
  );
}
