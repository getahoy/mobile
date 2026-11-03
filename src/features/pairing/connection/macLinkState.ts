import type { GoodbyeReason } from "@getahoy/protocol";
import { getNetworkStateAsync, NetworkStateType } from "expo-network";

export type MacLinkState =
  | { kind: "connecting" }
  | { kind: "connected"; locked: boolean }
  | { kind: "paused" }
  | { kind: "macOff" }
  | { kind: "macQuit" }
  | { kind: "macAsleep" }
  | { kind: "unreachable"; onCellular: boolean }
  | { kind: "macTooOld" }
  | { kind: "macTooNew" }
  | { kind: "unrecognised" };

type MacLinkKind = MacLinkState["kind"];

const RETRYING_KINDS: readonly MacLinkKind[] = [
  "unreachable",
  "macOff",
  "macQuit",
  "macAsleep",
];

const goodbyeStates: Partial<Record<GoodbyeReason, MacLinkState>> = {
  turned_off: { kind: "macOff" },
  quitting: { kind: "macQuit" },
  sleeping: { kind: "macAsleep" },
};

export function goodbyeState(reason: GoodbyeReason): MacLinkState | null {
  return goodbyeStates[reason] ?? null;
}

export function keepsRetrying(state: MacLinkState): boolean {
  return RETRYING_KINDS.includes(state.kind);
}

export async function unreachableState(): Promise<MacLinkState> {
  const network = await getNetworkStateAsync().catch(() => null);
  const onCellular = network?.type === NetworkStateType.CELLULAR;
  return { kind: "unreachable", onCellular };
}
