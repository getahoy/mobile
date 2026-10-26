import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { type PairedMac, readPairedMacs } from "../storage/pairedMacs";
import { usePairedMacsChanges } from "./usePairedMacsChanges";

export function usePairedMacs() {
  const [macs, setMacs] = useState<PairedMac[] | null>(null);
  const changes = usePairedMacsChanges();
  const reload = useCallback(() => {
    void readPairedMacs().then(setMacs);
  }, []);

  useFocusEffect(reload);
  useEffect(() => changes.onChange(reload), [changes, reload]);

  return { macs, reload };
}
