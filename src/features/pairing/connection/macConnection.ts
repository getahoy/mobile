import {
  type EndReason,
  endReasonSchema,
  type GoodbyeReason,
} from "@getahoy/protocol";
import { logger } from "@/features/logging/logger";
import { markReachedOnLan } from "@/features/permissions/storage/localNetworkMemory";
import { type PairedMac, updatePairedMac } from "../storage/pairedMacs";
import { type EndSource, endPairedMac } from "../sync/endedMacs";
import { createStageClock, type StageClock } from "./connectTiming";
import type { MacLink } from "./connectToMac";
import { dialMac } from "./dialMac";
import { BACKGROUND_GRACE_MS, resumeLink, retryDelay } from "./linkTiming";
import type { LiveMacLinks } from "./liveMacLinks";
import { MacLinkMemory } from "./macLinkMemory";
import { isLinking, keepsRetrying, type MacLinkState } from "./macLinkState";
import type { MacEvent, MacSession } from "./macSession";

type MacConnectionOptions = {
  mac: PairedMac;
  live: LiveMacLinks;
  onEnded: () => void;
};

export class MacConnection {
  readonly #options: MacConnectionOptions;
  #state: MacLinkState;
  #session: MacSession | null = null;
  #attempt = 0;
  #misses = 0;
  readonly #memory: MacLinkMemory;
  #retryTimer: ReturnType<typeof setTimeout> | null = null;
  #graceTimer: ReturnType<typeof setTimeout> | null = null;
  #foreground = true;

  constructor(options: MacConnectionOptions) {
    this.#options = options;
    this.#memory = new MacLinkMemory(options.mac.publicKey);
    const paused = options.mac.paused;
    this.#state = paused ? { kind: "paused" } : this.#memory.dialState();
  }

  state(): MacLinkState {
    return this.#state;
  }

  start(): void {
    if (this.#state.kind === "paused") this.#setState(this.#state);
    else this.connect();
  }

  stop(): void {
    this.#attempt += 1;
    this.#clearTimers();
    this.#dropSession()?.close();
  }

  connect(clock: StageClock = createStageClock(Date.now)): void {
    this.#setState(this.#memory.dialState());
    void this.#establish(clock);
  }

  pause(): void {
    this.sayGoodbye("paused");
    void updatePairedMac(this.#options.mac.publicKey, { paused: true });
    this.#setState({ kind: "paused" });
  }

  resume(): void {
    void updatePairedMac(this.#options.mac.publicKey, { paused: false });
    this.connect();
  }

  sayGoodbye(reason: GoodbyeReason): void {
    const session = this.#dropSession();
    this.stop();
    session?.goodbye(reason);
  }

  foreground(): void {
    this.#foreground = true;
    this.#misses = 0;
    this.#clearTimers();
    if (this.#state.kind === "paused") return;
    const clock = createStageClock(Date.now);
    clock.mark("foreground");
    void resumeLink(this.#session, () => this.connect(clock));
  }

  // A quick app switch keeps the session, so coming back costs no reconnect.
  background(): void {
    this.#foreground = false;
    this.#clearTimers();
    this.#graceTimer = setTimeout(() => this.stop(), BACKGROUND_GRACE_MS);
  }

  async #establish(clock: StageClock): Promise<void> {
    this.#dropSession()?.close();
    const attempt = ++this.#attempt;
    const link = await dialMac(this.#options.mac, clock);
    if (attempt === this.#attempt) return this.#apply(link, attempt);
    if (link.outcome === "connected") link.session.close();
  }

  async #apply(link: MacLink, attempt: number): Promise<void> {
    switch (link.outcome) {
      case "connected":
        return this.#adopt(link.session, attempt);
      case "ended":
        return this.#end(link.reason, "handshake");
      case "unreachable":
        return this.#settleUnreachable(attempt);
      case "unrecognised":
      case "macTooOld":
      case "macTooNew":
        return this.#setState({ kind: link.outcome });
      default: {
        const unhandled: never = link;
        return unhandled;
      }
    }
  }

  #adopt(session: MacSession, attempt: number): void {
    this.#session = session;
    this.#misses = 0;
    markReachedOnLan(this.#options.mac.publicKey);
    session.onEvent((event) => void this.#handle(event, attempt));
  }

  async #handle(event: MacEvent, attempt: number): Promise<void> {
    if (attempt !== this.#attempt) return;
    switch (event.kind) {
      case "status": {
        const { live, mac } = this.#options;
        if (this.#session) live.register(mac.publicKey, this.#session);
        this.#memory.clear();
        return this.#setState({ kind: "connected", locked: event.locked });
      }
      case "goodbye":
        return this.#goodbye(event.reason);
      case "commandReply":
        return;
      case "closed":
        this.#dropSession();
        if (!isLinking(this.#state)) return;
        return this.#settleUnreachable(attempt);
      default: {
        const unhandled: never = event;
        return unhandled;
      }
    }
  }

  async #settleUnreachable(attempt: number): Promise<void> {
    const state = await this.#memory.missState();
    if (attempt === this.#attempt) this.#setState(state);
  }

  async #goodbye(reason: GoodbyeReason): Promise<void> {
    const ending = endReasonSchema.safeParse(reason);
    if (ending.success) return this.#end(ending.data, "liveGoodbye");
    const state = this.#memory.goodbye(reason);
    if (!state) return;
    this.#dropSession();
    this.#setState(state);
  }

  async #end(reason: EndReason, source: EndSource): Promise<void> {
    this.#memory.clear();
    this.stop();
    await endPairedMac(this.#options.mac.publicKey, reason, source);
    this.#options.onEnded();
  }

  #dropSession(): MacSession | null {
    const session = this.#session;
    const { live, mac } = this.#options;
    if (session) live.unregister(mac.publicKey, session);
    this.#session = null;
    return session;
  }

  #setState(state: MacLinkState): void {
    if (__DEV__) logger.info("macLink", state.kind);
    this.#state = state;
    this.#options.live.reportState(this.#options.mac.publicKey, state);
    if (this.#retryTimer) clearTimeout(this.#retryTimer);
    if (!this.#foreground || !keepsRetrying(state)) return;
    const delay = retryDelay(state.kind, this.#misses++);
    const retry = () => void this.#establish(createStageClock(Date.now));
    this.#retryTimer = setTimeout(retry, delay);
  }

  #clearTimers(): void {
    if (this.#retryTimer) clearTimeout(this.#retryTimer);
    if (this.#graceTimer) clearTimeout(this.#graceTimer);
  }
}
