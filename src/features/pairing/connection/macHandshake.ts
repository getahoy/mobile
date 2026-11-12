import {
  decodeBytes,
  type InitiatorHandshake,
  type KeyPair,
  type SecureChannel,
  startInitiator,
} from "@getahoy/crypto";
import {
  decodeJson,
  type EndReason,
  encodeJson,
  handshakeReplySchema,
  type LanEndpoint,
  PROTOCOL_VERSION,
  unknownMacKeySchema,
} from "@getahoy/protocol";
import { phoneHello } from "../device/phoneDescription";
import type { PairedMac } from "../storage/pairedMacs";
import type { MarkStage } from "./connectTiming";
import type { FrameStream } from "./frameStream";

const REPLY_TIMEOUT_MS = 5000;

export type HandshakeOutcome =
  | {
      outcome: "connected";
      channel: SecureChannel;
      lan: LanEndpoint | null;
      capabilities: readonly string[];
    }
  | { outcome: "macTooOld" }
  | { outcome: "macTooNew" }
  | { outcome: "ended"; reason: EndReason }
  | { outcome: "unrecognised" }
  | { outcome: "unreachable" };

const UNREACHABLE: HandshakeOutcome = { outcome: "unreachable" };
const UNRECOGNISED: HandshakeOutcome = { outcome: "unrecognised" };

function readUnauthenticated(message: Uint8Array): HandshakeOutcome {
  const notice = unknownMacKeySchema.safeParse(decodeJson(message));
  return notice.success ? UNRECOGNISED : UNREACHABLE;
}

function readReply(
  handshake: InitiatorHandshake,
  message: Uint8Array,
): HandshakeOutcome {
  const opened = handshake.readReply(message);
  if (!opened) return readUnauthenticated(message);
  const reply = handshakeReplySchema.safeParse(decodeJson(opened.payload));
  if (!reply.success) return UNREACHABLE;
  switch (reply.data.type) {
    case "welcome": {
      const { channel } = opened;
      const lan = reply.data.lan ?? null;
      const { capabilities } = reply.data.hello;
      return { outcome: "connected", channel, lan, capabilities };
    }
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

type Handshake = {
  stream: FrameStream;
  keys: KeyPair;
  mac: PairedMac;
  mark: MarkStage;
};

export function shakeHands({
  stream,
  keys,
  mac,
  mark,
}: Handshake): Promise<HandshakeOutcome> {
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
      if (answered) return;
      mark("replyReceived");
      const outcome = readReply(handshake, message);
      mark("replyRead");
      answer(outcome);
    });
    const firstMessage = handshake.firstMessage(encodeJson(phoneHello()));
    mark("firstMessageBuilt");
    stream.send(firstMessage);
  });
}
