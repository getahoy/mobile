import type { PairedMac } from "../storage/pairedMacs";
import type { LiveMacLinks } from "./liveMacLinks";
import { MacConnection } from "./macConnection";
import { syncPlan } from "./syncPlan";

export class MacConnections {
  readonly #live: LiveMacLinks;
  readonly #connections = new Map<string, MacConnection>();

  constructor(live: LiveMacLinks) {
    this.#live = live;
  }

  sync(macs: readonly PairedMac[], onEnded: () => void): void {
    const plan = syncPlan(this.#connections.keys(), macs);
    for (const publicKey of plan.stop) {
      this.#connections.get(publicKey)?.stop();
      this.#connections.delete(publicKey);
    }
    for (const mac of plan.start) {
      const connection = new MacConnection({ mac, live: this.#live, onEnded });
      this.#connections.set(mac.publicKey, connection);
      connection.start();
    }
  }

  connection(publicKey: string): MacConnection | null {
    return this.#connections.get(publicKey) ?? null;
  }

  foreground(): void {
    for (const connection of this.#connections.values())
      connection.foreground();
  }

  background(): void {
    for (const connection of this.#connections.values())
      connection.background();
  }

  stopAll(): void {
    for (const connection of this.#connections.values()) connection.stop();
    this.#connections.clear();
  }
}
