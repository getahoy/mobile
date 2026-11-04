import { clearDeviceKeys } from "./deviceKeys";
import { clearPairedMacs } from "./pairedMacs";
import { pairingEntry, pairingKeychain } from "./pairingKeychain";
import { clearPendingUnlinks } from "./pendingUnlinks";

// Pairings outlive an automatic sign-out, so another account signing in must not inherit them.
export async function claimPairingsFor(userId: string): Promise<void> {
  const owner = await pairingKeychain.read(pairingEntry.owner);
  if (owner === userId) return;
  if (owner !== null) {
    await Promise.all([clearPairedMacs(), clearPendingUnlinks()]);
    await clearDeviceKeys();
  }
  await pairingKeychain.write(pairingEntry.owner, userId);
}
