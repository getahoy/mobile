import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/features/auth/client/authClient";
import { type PairedMac, readPairedMacs } from "../storage/pairedMacs";
import { settleStoredEndedMacs } from "../sync/endedMacs";
import { preparePairingsFor } from "../sync/preparePairings";
import { usePairedMacsChanges } from "./usePairedMacsChanges";

export function usePairedMacs() {
  const [macs, setMacs] = useState<PairedMac[] | null>(null);
  const changes = usePairedMacsChanges();
  const userId = authClient.useSession().data?.user.id ?? null;
  const reload = useCallback(() => {
    if (!userId) return;
    void preparePairingsFor(userId)
      .catch(() => undefined)
      .then(settleStoredEndedMacs)
      .then(readPairedMacs)
      .then(setMacs);
  }, [userId]);

  useFocusEffect(reload);
  useEffect(() => changes.onChange(reload), [changes, reload]);

  return { macs, reload };
}
