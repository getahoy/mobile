import {
  decodeBytes,
  type InitiatorHandshake,
  type KeyPair,
  type SecureChannel,
  startInitiator,
} from "@getahoy/crypto";
import {
  type Frame,
  handshakeReplySchema,
  PROTOCOL_VERSION,
} from "@getahoy/protocol";
import { phoneHello } from "../device/phoneDescription";
import type { PairedMac } from "../storage/pairedMacs";
import type { FrameStream } from "./frameStream";
import { decodeJson, encodeJson } from "./jsonBytes";

const REPLY_TIMEOUT_MS = 5000;

type HandshakeOutcome =
  | { outcome: "connected"; channel: SecureChannel }
  | { outcome: "macTooOld" }
  | { outcome: "macTooNew" }
  | { outcome: "rejected" };

const REJECTED: HandshakeOutcome = { outcome: "rejected" };
const READY: Frame = { type: "ready" };

function readReply(
  handshake: InitiatorHandshake,
  stream: FrameStream,
  message: Uint8Array,
): HandshakeOutcome {
  const opened = handshake.readReply(message);
  const reply = opened
    ? handshakeReplySchema.safeParse(decodeJson(opened.payload))
    : null;
  if (!opened || !reply?.success) {
    stream.close();
    return REJECTED;
  }
  switch (reply.data.type) {
    case "welcome":
      stream.send(opened.channel.seal(encodeJson(READY)));
      return { outcome: "connected", channel: opened.channel };
    case "refused":
      stream.close();
      return reply.data.protocolVersion < PROTOCOL_VERSION
        ? { outcome: "macTooOld" }
        : { outcome: "macTooNew" };
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
      resolve(outcome);
    };
    const timer = setTimeout(() => {
      stream.close();
      answer(REJECTED);
    }, REPLY_TIMEOUT_MS);
    stream.onClose(() => answer(REJECTED));
    stream.onFrame((message) => {
      if (!answered) answer(readReply(handshake, stream, message));
    });
    stream.send(handshake.firstMessage(encodeJson(phoneHello())));
  });
}
