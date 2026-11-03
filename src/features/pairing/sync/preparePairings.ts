import { onceForLatestKey } from "@/lib/onceForLatestKey";
import { claimPairingsFor } from "../storage/pairingOwner";
import { syncLinks } from "./linkSync";

const LINK_SYNC_CAP_MS = 1500;

// A slow network must not hold Home back; link sync retries on every foreground.
const linkSyncWithin = (limitMs: number) =>
  Promise.race([
    syncLinks(),
    new Promise<void>((resolve) => setTimeout(resolve, limitMs)),
  ]);

export const preparePairingsFor = onceForLatestKey(async (userId) => {
  await claimPairingsFor(userId);
  await linkSyncWithin(LINK_SYNC_CAP_MS);
});
