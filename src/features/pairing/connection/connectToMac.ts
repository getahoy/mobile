import type { KeyPair } from "@getahoy/crypto";
import type { PairedMac } from "../storage/pairedMacs";
import type { MarkStage } from "./connectTiming";
import type { Transport } from "./frameStream";
import { lanTransport } from "./lanTransport";
import { type HandshakeOutcome, shakeHands } from "./macHandshake";
import { MacSession } from "./macSession";

const transports: readonly Transport[] = [lanTransport];
const JUST_PAIRED_GRACE_MS = 30_000;
const JUST_PAIRED_RETRY_MS = 1000;

export type MacLink =
  | { outcome: "connected"; session: MacSession }
  | Exclude<HandshakeOutcome, { outcome: "connected" }>;

function macStillFinishing(mac: PairedMac, shaken: HandshakeOutcome): boolean {
  const notPaired =
    shaken.outcome === "ended" || shaken.outcome === "unrecognised";
  return notPaired && Date.now() - mac.pairedAt < JUST_PAIRED_GRACE_MS;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function connectToMac(
  mac: PairedMac,
  keys: KeyPair,
  mark: MarkStage,
): Promise<MacLink> {
  for (const transport of transports) {
    const stream = await transport.open(mac);
    if (!stream) continue;
    mark("socketOpen");
    const shaken = await shakeHands({ stream, keys, mac, mark });
    if (shaken.outcome === "unreachable") continue;
    if (macStillFinishing(mac, shaken)) {
      await wait(JUST_PAIRED_RETRY_MS);
      return connectToMac(mac, keys, mark);
    }
    if (shaken.outcome !== "connected") return shaken;
    return {
      outcome: "connected",
      session: new MacSession(stream, shaken.channel),
    };
  }
  return { outcome: "unreachable" };
}
