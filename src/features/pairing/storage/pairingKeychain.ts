import * as SecureStore from "expo-secure-store";
import { createMMKV } from "react-native-mmkv";
import { createPairingEntryStore } from "./pairingEntryStore";

export const pairingEntry = {
  deviceKeys: "ahoy.device.keys",
  pairedMacs: "ahoy.paired.macs",
  owner: "ahoy.pairing.owner",
  pendingUnlinks: "ahoy.pending.unlinks",
} as const;

const MIGRATED_KEY = "thisDeviceOnly";

const migrationStorage = createMMKV({ id: "ahoy.pairingKeychain" });

// The default Keychain class travels in backups and migrations, which would hand this
// phone's private key to another iPhone. ThisDeviceOnly still survives a reinstall.
export const pairingKeychain = createPairingEntryStore({
  keychain: SecureStore,
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  entries: Object.values(pairingEntry),
  migration: {
    done: () => migrationStorage.getBoolean(MIGRATED_KEY) === true,
    markDone: () => migrationStorage.set(MIGRATED_KEY, true),
  },
});
