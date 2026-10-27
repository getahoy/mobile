import { useEffect, useReducer } from "react";
import type { LiveMacLinks } from "@/features/pairing/connection/liveMacLinks";
import { useLiveMacLinks } from "@/features/pairing/hooks/useLiveMacLinks";
import type { PairedMac } from "@/features/pairing/storage/pairedMacs";
import type { TalkBlock } from "../talkState";

export type TalkTarget = { mac: PairedMac | null; block: TalkBlock | null };

function targetOf(macs: readonly PairedMac[], live: LiveMacLinks): TalkTarget {
  const reachable = macs.filter((mac) => !mac.ended);
  const stateOf = (mac: PairedMac) => live.state(mac.publicKey);
  const connected = reachable.find((mac) => stateOf(mac)?.kind === "connected");
  if (connected) {
    const state = stateOf(connected);
    const locked = state?.kind === "connected" && state.locked;
    return { mac: connected, block: locked ? "locked" : null };
  }
  const paused = reachable.find((mac) => stateOf(mac)?.kind === "paused");
  if (paused) return { mac: paused, block: "paused" };
  return { mac: reachable[0] ?? null, block: "noMac" };
}

export function useTalkTarget(macs: readonly PairedMac[]): TalkTarget {
  const live = useLiveMacLinks();
  const [, refresh] = useReducer((version: number) => version + 1, 0);
  // Mac cards report their first state while they render, so refresh after that render.
  useEffect(() => live.onChange(() => queueMicrotask(refresh)), [live]);
  return targetOf(macs, live);
}
