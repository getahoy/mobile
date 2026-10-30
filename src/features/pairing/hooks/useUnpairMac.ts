import { useState } from "react";
import type { ConfirmRequest } from "@/components/ui/confirmSheet";
import type { MacConnection } from "../connection/macConnection";
import { macCopy } from "../copy/macCopy";
import { type PairedMac, removePairedMac } from "../storage/pairedMacs";
import { flushPendingUnlinks, queueUnlink } from "../sync/linkSync";

async function unpair(mac: PairedMac, connection: MacConnection | null) {
  connection?.sayGoodbye("removed");
  await queueUnlink(mac.publicKey, "removed");
  await removePairedMac(mac.publicKey);
  await flushPendingUnlinks();
}

export function useUnpairMac(
  mac: PairedMac,
  connection: MacConnection | null,
  onRemoved: () => void,
) {
  const [asking, setAsking] = useState(false);
  const remove = () => {
    setAsking(false);
    void unpair(mac, connection)
      .catch(() => undefined)
      .finally(onRemoved);
  };
  const confirm: ConfirmRequest | null = asking
    ? {
        title: macCopy.removeTitle(mac.displayName),
        body: macCopy.removeBody(mac.displayName),
        confirmLabel: macCopy.removeConfirm,
        cancelLabel: macCopy.cancel,
        onConfirm: remove,
        onCancel: () => setAsking(false),
      }
    : null;
  return { askToRemove: () => setAsking(true), confirm };
}
