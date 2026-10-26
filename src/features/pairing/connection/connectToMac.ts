import type { KeyPair } from "@getahoy/crypto";
import type { PairedMac } from "../storage/pairedMacs";
import type { Transport } from "./frameStream";
import { lanTransport } from "./lanTransport";
import { type HandshakeOutcome, shakeHands } from "./macHandshake";
import { MacSession } from "./macSession";

const transports: readonly Transport[] = [lanTransport];

export type MacLink =
  | { outcome: "connected"; session: MacSession }
  | Exclude<HandshakeOutcome, { outcome: "connected" }>;

export async function connectToMac(
  mac: PairedMac,
  keys: KeyPair,
): Promise<MacLink> {
  for (const transport of transports) {
    const stream = await transport.open(mac);
    if (!stream) continue;
    const shaken = await shakeHands(stream, keys, mac);
    if (shaken.outcome === "unreachable") continue;
    if (shaken.outcome !== "connected") return shaken;
    return {
      outcome: "connected",
      session: new MacSession(stream, shaken.channel),
    };
  }
  return { outcome: "unreachable" };
}
