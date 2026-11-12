import type { SecureChannel } from "@getahoy/crypto";
import {
  type CommandFrame,
  decodeJson,
  encodeJson,
  type Frame,
  frameSchema,
  type GoodbyeReason,
} from "@getahoy/protocol";
import type { FrameStream } from "./frameStream";

const PING_INTERVAL_MS = 10_000;
const PONG_TIMEOUT_MS = 5000;

type CommandReply = Extract<
  CommandFrame,
  { type: "command.received" | "command.result" | "command.unknown" }
>;

export type MacEvent =
  | { kind: "goodbye"; reason: GoodbyeReason }
  | { kind: "status"; locked: boolean }
  | { kind: "commandReply"; reply: CommandReply }
  | { kind: "closed" };

export class MacSession {
  readonly #stream: FrameStream;
  readonly #channel: SecureChannel;
  readonly #capabilities: readonly string[];
  readonly #listeners = new Set<(event: MacEvent) => void>();
  readonly #pongWaiters = new Set<() => void>();
  readonly #heartbeat: ReturnType<typeof setInterval>;
  #pongTimer: ReturnType<typeof setTimeout> | null = null;
  #closed = false;

  constructor(
    stream: FrameStream,
    channel: SecureChannel,
    capabilities: readonly string[],
  ) {
    this.#stream = stream;
    this.#channel = channel;
    this.#capabilities = capabilities;
    this.#heartbeat = setInterval(() => this.#ping(), PING_INTERVAL_MS);
    stream.onFrame((sealed) => this.#receive(sealed));
    stream.onClose(() => this.#finish());
  }

  isOpen(): boolean {
    return !this.#closed;
  }

  can(capability: string): boolean {
    return this.#capabilities.includes(capability);
  }

  onEvent(listener: (event: MacEvent) => void): () => void {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  send(frame: Frame): void {
    if (this.#closed) return;
    this.#stream.send(this.#channel.seal(encodeJson(frame)));
  }

  probe(timeoutMs: number): Promise<boolean> {
    if (this.#closed) return Promise.resolve(false);
    return new Promise((resolve) => {
      const answer = (alive: boolean) => {
        clearTimeout(timer);
        this.#pongWaiters.delete(onPong);
        resolve(alive);
      };
      const onPong = () => answer(true);
      const timer = setTimeout(() => answer(false), timeoutMs);
      this.#pongWaiters.add(onPong);
      this.send({ type: "ping" });
    });
  }

  goodbye(reason: GoodbyeReason): void {
    this.send({ type: "goodbye", reason });
    this.close();
  }

  close(): void {
    this.#stream.close();
    this.#finish();
  }

  #ping(): void {
    if (this.#pongTimer) return;
    this.send({ type: "ping" });
    this.#pongTimer = setTimeout(() => this.close(), PONG_TIMEOUT_MS);
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
        for (const waiter of this.#pongWaiters) waiter();
        return;
      case "ping":
        this.send({ type: "pong" });
        return;
      case "command.received":
      case "command.result":
      case "command.unknown":
        this.#emit({ kind: "commandReply", reply: frame.data });
        return;
      case "ready":
      case "command":
      case "command.choose":
      case "command.lookup":
      case "speech.stop":
      case "choice.extend":
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
