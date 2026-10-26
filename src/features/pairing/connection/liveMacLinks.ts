import type { GoodbyeReason } from "@getahoy/protocol";
import type { MacSession } from "./macSession";

export class LiveMacLinks {
  readonly #sessions = new Map<string, MacSession>();

  register(publicKey: string, session: MacSession): void {
    this.#sessions.set(publicKey, session);
  }

  unregister(publicKey: string, session: MacSession): void {
    if (this.#sessions.get(publicKey) === session) {
      this.#sessions.delete(publicKey);
    }
  }

  goodbyeAll(reason: GoodbyeReason): void {
    for (const session of this.#sessions.values()) session.goodbye(reason);
    this.#sessions.clear();
  }
}
