import {
  type EndReason,
  endReasonSchema,
  type GoodbyeReason,
} from "@getahoy/protocol";
import { loadDeviceKeys } from "../storage/deviceKeys";
import { type PairedMac, updatePairedMac } from "../storage/pairedMacs";
import { connectToMac, type MacLink } from "./connectToMac";
import type { LiveMacLinks } from "./liveMacLinks";
import {
  keepsRetrying,
  type MacLinkState,
  unreachableState,
} from "./macLinkState";
import type { MacEvent, MacSession } from "./macSession";

const AUTO_RETRY_MS = 5000;
const UNREACHABLE_LINK: MacLink = { outcome: "unreachable" };

const goodbyeStates: Partial<Record<GoodbyeReason, MacLinkState>> = {
  turned_off: { kind: "macOff" },
  quitting: { kind: "macQuit" },
  sleeping: { kind: "macAsleep" },
};

type MacConnectionOptions = {
  mac: PairedMac;
  live: LiveMacLinks;
  onEnded: () => void;
};

export class MacConnection {
  readonly #options: MacConnectionOptions;
  readonly #listeners = new Set<(state: MacLinkState) => void>();
  #state: MacLinkState;
  #session: MacSession | null = null;
  #attempt = 0;
  #lastReason: MacLinkState | null = null;
  #retryTimer: ReturnType<typeof setTimeout> | null = null;
  #foreground = true;

  constructor(options: MacConnectionOptions) {
    this.#options = options;
    this.#state = options.mac.paused
      ? { kind: "paused" }
      : { kind: "connecting" };
    options.live.reportState(options.mac.publicKey, this.#state);
  }

  state(): MacLinkState {
    return this.#state;
  }

  onState(listener: (state: MacLinkState) => void): () => void {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  start(): void {
    if (this.#state.kind !== "paused") this.connect();
  }

  stop(): void {
    this.#attempt += 1;
    if (this.#retryTimer) clearTimeout(this.#retryTimer);
    this.#dropSession()?.close();
  }

  connect(): void {
    this.#setState({ kind: "connecting" });
    void this.#establish();
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
    const { kind } = this.#state;
    if (!this.#session && kind !== "paused" && kind !== "ended") this.connect();
  }

  background(): void {
    this.#foreground = false;
    this.stop();
  }

  async #establish(): Promise<void> {
    this.#dropSession()?.close();
    const attempt = ++this.#attempt;
    const link = await loadDeviceKeys()
      .then((keys) => connectToMac(this.#options.mac, keys))
      .catch(() => UNREACHABLE_LINK);
    if (attempt !== this.#attempt) {
      if (link.outcome === "connected") link.session.close();
      return;
    }
    await this.#apply(link, attempt);
  }

  async #apply(link: MacLink, attempt: number): Promise<void> {
    switch (link.outcome) {
      case "connected":
        this.#adopt(link.session, attempt);
        return;
      case "ended":
        await this.#end(link.reason);
        return;
      case "unreachable":
        this.#setState(this.#lastReason ?? (await unreachableState()));
        return;
      case "unrecognised":
      case "macTooOld":
      case "macTooNew":
        this.#setState({ kind: link.outcome });
        return;
      default: {
        const unhandled: never = link;
        throw new Error(`Unhandled link ${JSON.stringify(unhandled)}`);
      }
    }
  }

  #adopt(session: MacSession, attempt: number): void {
    this.#session = session;
    this.#lastReason = null;
    this.#options.live.register(this.#options.mac.publicKey, session);
    session.onEvent((event) => {
      if (attempt === this.#attempt) void this.#handle(event);
    });
    this.#setState({ kind: "connected", locked: false });
  }

  async #handle(event: MacEvent): Promise<void> {
    if (event.kind === "status") {
      this.#setState({ kind: "connected", locked: event.locked });
      return;
    }
    if (event.kind === "goodbye") {
      await this.#goodbye(event.reason);
      return;
    }
    this.#dropSession();
    if (this.#state.kind !== "connected") return;
    this.#setState(this.#lastReason ?? (await unreachableState()));
  }

  async #goodbye(reason: GoodbyeReason): Promise<void> {
    const ending = endReasonSchema.safeParse(reason);
    if (ending.success) {
      await this.#end(ending.data);
      return;
    }
    const state = goodbyeStates[reason];
    if (!state) return;
    this.#lastReason = state;
    this.#dropSession();
    this.#setState(state);
  }

  async #end(reason: EndReason): Promise<void> {
    this.stop();
    const ended = { reason, at: Date.now() };
    await updatePairedMac(this.#options.mac.publicKey, { ended });
    this.#setState({ kind: "ended", reason });
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
    this.#state = state;
    this.#options.live.reportState(this.#options.mac.publicKey, state);
    for (const listener of this.#listeners) listener(state);
    if (this.#retryTimer) clearTimeout(this.#retryTimer);
    if (!this.#foreground || !keepsRetrying(state)) return;
    this.#retryTimer = setTimeout(() => void this.#establish(), AUTO_RETRY_MS);
  }
}
