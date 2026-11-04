import { useEffect, useEffectEvent } from "react";
import { BackHandler } from "react-native";
import { backToClose } from "./backToClose";

// Listeners run last-registered first, so subscribing only when `open` flips
// keeps a later sheet above earlier listeners across re-renders.
export function useBackToClose(open: boolean, close: () => void): void {
  const onBack = useEffectEvent(() => backToClose(open, close));

  useEffect(() => {
    if (!open) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () =>
      onBack(),
    );
    return () => subscription.remove();
  }, [open]);
}
