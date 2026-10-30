import type { MacLinkState } from "./connection/macLinkState.ts";

export const LINK_BLIP_MS = 1500;

const BLIP_KINDS: readonly MacLinkState["kind"][] = [
  "connecting",
  "unreachable",
];

export function isLinkBlip(shown: MacLinkState, next: MacLinkState): boolean {
  return shown.kind === "connected" && BLIP_KINDS.includes(next.kind);
}
