import { encodeBytes } from "@getahoy/crypto";
import { Alert } from "react-native";
import { unlinkPairing } from "../client/pairingApi";
import { pairingCopy } from "../copy/pairingCopy";
import { loadDeviceKeys } from "../storage/deviceKeys";
import { type PairedMac, removePairedMac } from "../storage/pairedMacs";

async function unpair(mac: PairedMac): Promise<void> {
  const keys = await loadDeviceKeys().catch(() => null);
  if (keys) {
    await unlinkPairing({
      devicePublicKey: encodeBytes(keys.publicKey),
      peerPublicKey: mac.publicKey,
    });
  }
  await removePairedMac(mac.publicKey);
}

export function useUnpairMac(mac: PairedMac, onRemoved: () => void) {
  const remove = () =>
    void unpair(mac)
      .catch(() => undefined)
      .finally(onRemoved);
  return () =>
    Alert.alert(
      `${pairingCopy["remove.title"]} ${mac.displayName}?`,
      pairingCopy["remove.body"],
      [
        { text: pairingCopy["remove.cancel"], style: "cancel" },
        {
          text: pairingCopy["remove.confirm"],
          style: "destructive",
          onPress: remove,
        },
      ],
    );
}
