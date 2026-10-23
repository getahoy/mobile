import type { KeyPair, SecureChannel } from "@getahoy/crypto";
import type { PairedMac } from "../storage/pairedMacs";
import type { FrameStream, Transport } from "./frameStream";
import { lanTransport } from "./lanTransport";
import { shakeHands } from "./macHandshake";

const transports: readonly Transport[] = [lanTransport];

export type MacLink =
  | { outcome: "connected"; stream: FrameStream; channel: SecureChannel }
  | { outcome: "unreachable" }
  | { outcome: "macTooOld" }
  | { outcome: "macTooNew" }
  | { outcome: "rejected" };

export async function connectToMac(
  mac: PairedMac,
  keys: KeyPair,
): Promise<MacLink> {
  for (const transport of transports) {
    const stream = await transport.open(mac);
    if (!stream) continue;
    const shaken = await shakeHands(stream, keys, mac);
    if (shaken.outcome !== "connected") return shaken;
    return { outcome: "connected", stream, channel: shaken.channel };
  }
  return { outcome: "unreachable" };
}
