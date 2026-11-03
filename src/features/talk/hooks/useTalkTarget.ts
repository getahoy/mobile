import { useSyncExternalStore } from "react";
import { useLiveMacLinks } from "@/features/pairing/hooks/useLiveMacLinks";
import type { PairedMac } from "@/features/pairing/storage/pairedMacs";
import { useSelectedMac } from "@/features/pairing/storage/selectedMac";

export function useTalkTarget(macs: readonly PairedMac[]): PairedMac | null {
  const live = useLiveMacLinks();
  const { selectedKey } = useSelectedMac();
  useSyncExternalStore(live.onChange, live.version);
  const connected = (mac: PairedMac) =>
    live.state(mac.publicKey)?.kind === "connected";
  return (
    macs.find((mac) => mac.publicKey === selectedKey) ??
    macs.find(connected) ??
    macs[0] ??
    null
  );
}
