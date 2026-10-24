import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { type PairedMac, readPairedMacs } from "../storage/pairedMacs";

export function usePairedMacs() {
  const [macs, setMacs] = useState<PairedMac[] | null>(null);
  const reload = useCallback(() => {
    void readPairedMacs().then(setMacs);
  }, []);

  useFocusEffect(reload);

  return { macs, reload };
}
