import type { GoodbyeReason } from "@getahoy/protocol";
import type { MacLinkState } from "./macLinkState";
import type { MacSession } from "./macSession";

export class LiveMacLinks {
  readonly #sessions = new Map<string, MacSession>();
  readonly #states = new Map<string, MacLinkState>();
  readonly #listeners = new Set<() => void>();
  #version = 0;

  register(publicKey: string, session: MacSession): void {
    this.#sessions.set(publicKey, session);
  }

  unregister(publicKey: string, session: MacSession): void {
    if (this.#sessions.get(publicKey) === session) {
      this.#sessions.delete(publicKey);
    }
  }

  session(publicKey: string): MacSession | null {
    return this.#sessions.get(publicKey) ?? null;
  }

  reportState(publicKey: string, state: MacLinkState): void {
    this.#states.set(publicKey, state);
    this.#version += 1;
    for (const listener of this.#listeners) listener();
  }

  state(publicKey: string): MacLinkState | null {
    return this.#states.get(publicKey) ?? null;
  }

  readonly version = (): number => this.#version;

  readonly onChange = (listener: () => void): (() => void) => {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  };

  goodbyeAll(reason: GoodbyeReason): void {
    for (const session of this.#sessions.values()) session.goodbye(reason);
    this.#sessions.clear();
  }
}
