import { useSyncExternalStore } from "react";
import type { LiveMacLinks } from "@/features/pairing/connection/liveMacLinks";
import type { MacLinkState } from "@/features/pairing/connection/macLinkState";
import { useLiveMacLinks } from "@/features/pairing/hooks/useLiveMacLinks";
import type { PairedMac } from "@/features/pairing/storage/pairedMacs";
import { useSelectedMac } from "@/features/pairing/storage/selectedMac";
import type { TalkBlock } from "../talkState";

export type TalkTarget = { mac: PairedMac | null; block: TalkBlock | null };

function blockOf(state: MacLinkState | null): TalkBlock | null {
  if (state?.kind === "connected") return state.locked ? "locked" : null;
  if (state?.kind === "paused") return "paused";
  return "noMac";
}

function targetOf(
  macs: readonly PairedMac[],
  live: LiveMacLinks,
  selectedKey: string | null,
): TalkTarget {
  const stateOf = (mac: PairedMac) => live.state(mac.publicKey);
  const mac =
    macs.find((candidate) => candidate.publicKey === selectedKey) ??
    macs.find((candidate) => stateOf(candidate)?.kind === "connected") ??
    macs[0] ??
    null;
  if (!mac) return { mac: null, block: "noMac" };
  return { mac, block: blockOf(stateOf(mac)) };
}

export function useTalkTarget(macs: readonly PairedMac[]): TalkTarget {
  const live = useLiveMacLinks();
  const { selectedKey } = useSelectedMac();
  useSyncExternalStore(live.onChange, live.version);
  return targetOf(macs, live, selectedKey);
}
