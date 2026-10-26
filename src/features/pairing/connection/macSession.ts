import type { SecureChannel } from "@getahoy/crypto";
import { type Frame, frameSchema, type GoodbyeReason } from "@getahoy/protocol";
import type { FrameStream } from "./frameStream";
import { decodeJson, encodeJson } from "./jsonBytes";

const PING_INTERVAL_MS = 10_000;
const PONG_TIMEOUT_MS = 5000;

export type MacEvent =
  | { kind: "goodbye"; reason: GoodbyeReason }
  | { kind: "status"; locked: boolean }
  | { kind: "closed" };

export class MacSession {
  readonly #stream: FrameStream;
  readonly #channel: SecureChannel;
  readonly #listeners = new Set<(event: MacEvent) => void>();
  readonly #heartbeat: ReturnType<typeof setInterval>;
  #pongTimer: ReturnType<typeof setTimeout> | null = null;
  #closed = false;

  constructor(stream: FrameStream, channel: SecureChannel) {
    this.#stream = stream;
    this.#channel = channel;
    this.#heartbeat = setInterval(() => this.#ping(), PING_INTERVAL_MS);
    stream.onFrame((sealed) => this.#receive(sealed));
    stream.onClose(() => this.#finish());
  }

  onEvent(listener: (event: MacEvent) => void): void {
    this.#listeners.add(listener);
  }

  goodbye(reason: GoodbyeReason): void {
    this.#send({ type: "goodbye", reason });
    this.close();
  }

  close(): void {
    this.#stream.close();
    this.#finish();
  }

  #ping(): void {
    if (this.#pongTimer) return;
    this.#send({ type: "ping" });
    this.#pongTimer = setTimeout(() => this.close(), PONG_TIMEOUT_MS);
  }

  #send(frame: Frame): void {
    if (this.#closed) return;
    this.#stream.send(this.#channel.seal(encodeJson(frame)));
  }

  #receive(sealed: Uint8Array): void {
    const opened = this.#channel.open(sealed);
    const frame = opened ? frameSchema.safeParse(decodeJson(opened)) : null;
    if (!frame?.success) {
      this.close();
      return;
    }
    switch (frame.data.type) {
      case "goodbye":
        this.#emit({ kind: "goodbye", reason: frame.data.reason });
        return;
      case "status":
        this.#emit({ kind: "status", locked: frame.data.locked });
        return;
      case "pong":
        if (this.#pongTimer) clearTimeout(this.#pongTimer);
        this.#pongTimer = null;
        return;
      case "ping":
        this.#send({ type: "pong" });
        return;
      case "ready":
      case "audio.start":
      case "audio.chunk":
      case "audio.end":
      case "audio.cancel":
      case "audio.received":
      case "audio.rejected":
      case "command":
      case "command.received":
      case "command.result":
        return;
      default: {
        const unhandled: never = frame.data;
        throw new Error(`Unhandled frame ${JSON.stringify(unhandled)}`);
      }
    }
  }

  #finish(): void {
    if (this.#closed) return;
    this.#closed = true;
    clearInterval(this.#heartbeat);
    if (this.#pongTimer) clearTimeout(this.#pongTimer);
    this.#emit({ kind: "closed" });
  }

  #emit(event: MacEvent): void {
    for (const listener of this.#listeners) listener(event);
  }
}
