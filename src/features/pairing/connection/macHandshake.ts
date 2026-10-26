import {
  decodeBytes,
  type InitiatorHandshake,
  type KeyPair,
  type SecureChannel,
  startInitiator,
} from "@getahoy/crypto";
import {
  type EndReason,
  type Frame,
  handshakeReplySchema,
  PROTOCOL_VERSION,
  unknownMacKeySchema,
} from "@getahoy/protocol";
import { phoneHello } from "../device/phoneDescription";
import type { PairedMac } from "../storage/pairedMacs";
import type { FrameStream } from "./frameStream";
import { decodeJson, encodeJson } from "./jsonBytes";

const REPLY_TIMEOUT_MS = 5000;

export type HandshakeOutcome =
  | { outcome: "connected"; channel: SecureChannel }
  | { outcome: "macTooOld" }
  | { outcome: "macTooNew" }
  | { outcome: "ended"; reason: EndReason }
  | { outcome: "unrecognised" }
  | { outcome: "unreachable" };

const UNREACHABLE: HandshakeOutcome = { outcome: "unreachable" };
const UNRECOGNISED: HandshakeOutcome = { outcome: "unrecognised" };
const READY: Frame = { type: "ready" };

function readUnauthenticated(message: Uint8Array): HandshakeOutcome {
  const notice = unknownMacKeySchema.safeParse(decodeJson(message));
  return notice.success ? UNRECOGNISED : UNREACHABLE;
}

function readReply(
  handshake: InitiatorHandshake,
  stream: FrameStream,
  message: Uint8Array,
): HandshakeOutcome {
  const opened = handshake.readReply(message);
  if (!opened) return readUnauthenticated(message);
  const reply = handshakeReplySchema.safeParse(decodeJson(opened.payload));
  if (!reply.success) return UNREACHABLE;
  switch (reply.data.type) {
    case "welcome":
      stream.send(opened.channel.seal(encodeJson(READY)));
      return { outcome: "connected", channel: opened.channel };
    case "version_mismatch":
      return reply.data.protocolVersion < PROTOCOL_VERSION
        ? { outcome: "macTooOld" }
        : { outcome: "macTooNew" };
    case "not_paired": {
      const { detail } = reply.data;
      if (detail === "unknown") return UNRECOGNISED;
      return { outcome: "ended", reason: detail };
    }
    default: {
      const unhandled: never = reply.data;
      return unhandled;
    }
  }
}

export function shakeHands(
  stream: FrameStream,
  keys: KeyPair,
  mac: PairedMac,
): Promise<HandshakeOutcome> {
  return new Promise((resolve) => {
    const handshake = startInitiator(keys, decodeBytes(mac.publicKey));
    let answered = false;
    const answer = (outcome: HandshakeOutcome) => {
      if (answered) return;
      answered = true;
      clearTimeout(timer);
      if (outcome.outcome !== "connected") stream.close();
      resolve(outcome);
    };
    const timer = setTimeout(() => answer(UNREACHABLE), REPLY_TIMEOUT_MS);
    stream.onClose(() => answer(UNREACHABLE));
    stream.onFrame((message) => {
      if (!answered) answer(readReply(handshake, stream, message));
    });
    stream.send(handshake.firstMessage(encodeJson(phoneHello())));
  });
}
