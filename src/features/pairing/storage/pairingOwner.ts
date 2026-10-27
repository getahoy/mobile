import * as SecureStore from "expo-secure-store";
import { clearDeviceKeys } from "./deviceKeys";
import { clearPairedMacs } from "./pairedMacs";
import { clearPendingUnlinks } from "./pendingUnlinks";

const PAIRING_OWNER_ENTRY = "ahoy.pairing.owner";

// Pairings outlive an automatic sign-out, so another account signing in must not inherit them.
export async function claimPairingsFor(userId: string): Promise<void> {
  const owner = await SecureStore.getItemAsync(PAIRING_OWNER_ENTRY);
  if (owner === userId) return;
  if (owner !== null) {
    await Promise.all([clearPairedMacs(), clearPendingUnlinks()]);
    await clearDeviceKeys();
  }
  await SecureStore.setItemAsync(PAIRING_OWNER_ENTRY, userId);
}
