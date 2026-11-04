import type { HapticEvent } from "@/lib/hapticEvents";

export type EndSource = "liveGoodbye" | "handshake" | "sync" | "removedOnPhone";

export function endedHaptic(
  source: EndSource,
  whileClosed: boolean,
): HapticEvent | null {
  return source === "liveGoodbye" && !whileClosed ? "pairingEnded" : null;
}
