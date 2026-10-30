import type { PairedMac } from "../storage/pairedMacs";

export type SyncPlan = { start: PairedMac[]; stop: string[] };

export function syncPlan(
  running: Iterable<string>,
  macs: readonly PairedMac[],
): SyncPlan {
  const wanted = macs.filter((mac) => !mac.ended);
  const wantedKeys = new Set(wanted.map((mac) => mac.publicKey));
  const runningKeys = new Set(running);
  return {
    start: wanted.filter((mac) => !runningKeys.has(mac.publicKey)),
    stop: [...runningKeys].filter((key) => !wantedKeys.has(key)),
  };
}
