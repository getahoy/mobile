import {
  DarkTheme,
  DefaultTheme,
  type Theme,
} from "expo-router/react-navigation";
import { useCSSVariable, useUniwind } from "uniwind";

const navigationColorVariables = [
  "--color-background",
  "--color-border",
  "--color-card",
  "--color-destructive",
  "--color-primary",
  "--color-foreground",
] as const;

type NavigationColor = Theme["colors"]["background"];

function asColor(
  variable: string | number | undefined,
  fallback: NavigationColor,
): NavigationColor {
  return typeof variable === "string" ? variable : fallback;
}

export function useNavigationTheme(): Theme {
  const { theme } = useUniwind();
  const base = theme === "dark" ? DarkTheme : DefaultTheme;
  const [background, border, card, notification, primary, text] =
    useCSSVariable([...navigationColorVariables]);

  return {
    ...base,
    colors: {
      background: asColor(background, base.colors.background),
      border: asColor(border, base.colors.border),
      card: asColor(card, base.colors.card),
      notification: asColor(notification, base.colors.notification),
      primary: asColor(primary, base.colors.primary),
      text: asColor(text, base.colors.text),
    },
  };
}
