import { useEffect, useRef } from "react";
import { haptic } from "@/lib/haptics";
import type { ScannerState } from "../scannerFlow";

export function useScannerHaptics(state: ScannerState): void {
  const detected = useRef<string | null>(null);
  useEffect(() => {
    if (state.kind === "paired") {
      haptic("paired");
      return;
    }
    if (state.kind !== "claiming" || detected.current === state.code) return;
    detected.current = state.code;
    haptic("qrDetected");
  }, [state]);
}
