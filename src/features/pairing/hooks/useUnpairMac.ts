import { Alert } from "react-native";
import type { MacConnection } from "../connection/macConnection";
import { macCopy } from "../copy/macCopy";
import { type PairedMac, removePairedMac } from "../storage/pairedMacs";
import { flushPendingUnlinks, queueUnlink } from "../sync/linkSync";

async function unpair(mac: PairedMac, connection: MacConnection) {
  connection.sayGoodbye("removed");
  await queueUnlink(mac.publicKey, "removed");
  await removePairedMac(mac.publicKey);
  await flushPendingUnlinks();
}

export function useUnpairMac(
  mac: PairedMac,
  connection: MacConnection,
  onRemoved: () => void,
) {
  const remove = () =>
    void unpair(mac, connection)
      .catch(() => undefined)
      .finally(onRemoved);
  return () =>
    Alert.alert(
      macCopy.removeTitle(mac.displayName),
      macCopy.removeBody(mac.displayName),
      [
        { text: macCopy.cancel, style: "cancel" },
        { text: macCopy.removeConfirm, style: "destructive", onPress: remove },
      ],
    );
}
