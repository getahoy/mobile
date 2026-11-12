import type { KeyPair } from "@getahoy/crypto";
import type { LanEndpoint } from "@getahoy/protocol";
import type { PairedMac } from "../storage/pairedMacs";
import type { MarkStage } from "./connectTiming";
import type { Dialed, Transport } from "./frameStream";
import { type HandshakeMiss, handshakeVerdict } from "./handshakeVerdict";
import { lanTransport } from "./lanTransport";
import { type HandshakeOutcome, shakeHands } from "./macHandshake";
import { MacSession } from "./macSession";

const transports: readonly Transport[] = [lanTransport];
const JUST_PAIRED_GRACE_MS = 30_000;
const JUST_PAIRED_RETRY_MS = 1000;

export type ConnectedLink = {
  outcome: "connected";
  session: MacSession;
  ip: string | null;
  lan: LanEndpoint | null;
};

export type MacLink = ConnectedLink | HandshakeMiss;

type Connected = Extract<HandshakeOutcome, { outcome: "connected" }>;
type Shaken = Dialed & { handshake: HandshakeOutcome };
type Winner = Dialed & { handshake: Connected };
type Race =
  | { kind: "won"; winner: Winner }
  | { kind: "missed"; miss: HandshakeMiss };
type Attempt = { transport: Transport; mac: PairedMac; keys: KeyPair };

function macStillFinishing(mac: PairedMac, miss: HandshakeMiss): boolean {
  const notPaired = miss.outcome === "ended" || miss.outcome === "unrecognised";
  return notPaired && Date.now() - mac.pairedAt < JUST_PAIRED_GRACE_MS;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isWinner(shaken: Shaken | null): shaken is Winner {
  return shaken?.handshake.outcome === "connected";
}

// Every address is dialled and shaken at once; a socket that opens but fails
// the handshake leaves the others running, so a stale IP cannot end the try.
function firstConnected(attempts: Promise<Shaken | null>[]): Promise<Race> {
  return new Promise((resolve) => {
    const misses: HandshakeMiss[] = [];
    let pending = attempts.length;
    let won = false;
    const missed = () =>
      resolve({ kind: "missed", miss: handshakeVerdict(misses) });
    if (pending === 0) missed();
    for (const attempt of attempts) {
      void attempt.then((shaken) => {
        pending -= 1;
        if (isWinner(shaken)) {
          if (won) shaken.stream.close();
          else resolve({ kind: "won", winner: shaken });
          won = true;
        } else if (shaken && shaken.handshake.outcome !== "connected") {
          misses.push(shaken.handshake);
        }
        if (pending === 0 && !won) missed();
      });
    }
  });
}

function shakeAll({ transport, mac, keys }: Attempt, mark: MarkStage) {
  const attempts = transport.dial(mac).map(async (dialing) => {
    const dialed = await dialing;
    if (!dialed) return null;
    mark("socketOpen");
    const { stream } = dialed;
    const handshake = await shakeHands({ stream, keys, mac, mark });
    return { ...dialed, handshake };
  });
  return firstConnected(attempts);
}

export async function connectToMac(
  mac: PairedMac,
  keys: KeyPair,
  mark: MarkStage,
): Promise<MacLink> {
  for (const transport of transports) {
    const race = await shakeAll({ transport, mac, keys }, mark);
    if (race.kind === "missed") {
      if (race.miss.outcome === "unreachable") continue;
      if (!macStillFinishing(mac, race.miss)) return race.miss;
      await wait(JUST_PAIRED_RETRY_MS);
      return connectToMac(mac, keys, mark);
    }
    const { stream, ip, handshake } = race.winner;
    const session = new MacSession(stream, handshake.channel);
    session.send({ type: "ready" });
    return { outcome: "connected", session, ip, lan: handshake.lan };
  }
  return { outcome: "unreachable" };
}
