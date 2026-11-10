import { setBackgroundColorAsync } from "expo-system-ui";
import { useEffect } from "react";
import { useCSSVariable } from "uniwind";

// app.config.ts can only give the native root view one colour; behind modals, sheets
// and the keyboard it must follow the resolved theme.
export function useRootBackground(): void {
  const canvas = useCSSVariable("--color-sailcloth");
  useEffect(() => {
    if (typeof canvas === "string") void setBackgroundColorAsync(canvas);
  }, [canvas]);
}
