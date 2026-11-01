import type { PairedMac } from "../storage/pairedMacs";

type SyncPlan = { start: PairedMac[]; stop: string[] };

export function syncPlan(
  running: Iterable<string>,
  macs: readonly PairedMac[],
): SyncPlan {
  const wantedKeys = new Set(macs.map((mac) => mac.publicKey));
  const runningKeys = new Set(running);
  return {
    start: macs.filter((mac) => !runningKeys.has(mac.publicKey)),
    stop: [...runningKeys].filter((key) => !wantedKeys.has(key)),
  };
}
