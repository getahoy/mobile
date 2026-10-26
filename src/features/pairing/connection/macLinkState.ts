import type { EndReason } from "@getahoy/protocol";
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
  | { kind: "unrecognised" }
  | { kind: "ended"; reason: EndReason };

export type MacLinkKind = MacLinkState["kind"];

const RETRYING_KINDS: readonly MacLinkKind[] = [
  "unreachable",
  "macOff",
  "macQuit",
  "macAsleep",
];

export function keepsRetrying(state: MacLinkState): boolean {
  return RETRYING_KINDS.includes(state.kind);
}

export async function unreachableState(): Promise<MacLinkState> {
  const network = await getNetworkStateAsync().catch(() => null);
  const onCellular = network?.type === NetworkStateType.CELLULAR;
  return { kind: "unreachable", onCellular };
}
