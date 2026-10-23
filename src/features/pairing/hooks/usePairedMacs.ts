import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { type PairedMac, readPairedMacs } from "../storage/pairedMacs";

export function usePairedMacs(): PairedMac[] | null {
  const [macs, setMacs] = useState<PairedMac[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let current = true;
      void readPairedMacs().then((stored) => {
        if (current) setMacs(stored);
      });
      return () => {
        current = false;
      };
    }, []),
  );

  return macs;
}
