import type { PairedMac } from "../storage/pairedMacs";
import type { LiveMacLinks } from "./liveMacLinks";
import { MacConnection } from "./macConnection";

export class MacConnections {
  readonly #live: LiveMacLinks;
  readonly #connections = new Map<string, MacConnection>();

  constructor(live: LiveMacLinks) {
    this.#live = live;
  }

  sync(macs: readonly PairedMac[], onEnded: () => void): void {
    const wanted = new Set(
      macs.filter((mac) => !mac.ended).map((mac) => mac.publicKey),
    );
    for (const [publicKey, connection] of this.#connections) {
      if (wanted.has(publicKey)) continue;
      connection.stop();
      this.#connections.delete(publicKey);
    }
    for (const mac of macs) {
      if (mac.ended || this.#connections.has(mac.publicKey)) continue;
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
