import type { GoodbyeReason } from "@getahoy/protocol";
import {
  type RememberedGoodbye,
  readMacGoodbye,
  saveMacGoodbye,
} from "../storage/macGoodbyes";
import { type MacLinkState, unreachableState } from "./macLinkState";

type RememberedReason = RememberedGoodbye["reason"];

const CONNECTING: MacLinkState = { kind: "connecting" };

const goodbyeStates: Record<RememberedReason, MacLinkState> = {
  turned_off: { kind: "macOff" },
  quitting: { kind: "macQuit" },
  sleeping: { kind: "macAsleep" },
};

function isRemembered(reason: GoodbyeReason): reason is RememberedReason {
  return reason in goodbyeStates;
}

export class MacLinkMemory {
  readonly #publicKey: string;
  #memory: RememberedGoodbye | null;

  constructor(publicKey: string) {
    this.#publicKey = publicKey;
    this.#memory = readMacGoodbye(publicKey);
  }

  dialState(): MacLinkState {
    return this.#shown() ?? CONNECTING;
  }

  async missState(): Promise<MacLinkState> {
    return this.#shown() ?? (await unreachableState());
  }

  goodbye(reason: GoodbyeReason): MacLinkState | null {
    if (!isRemembered(reason)) return null;
    this.#save({ reason, at: Date.now() });
    return goodbyeStates[reason];
  }

  clear(): void {
    if (this.#memory) this.#save(null);
  }

  #shown(): MacLinkState | null {
    return this.#memory ? goodbyeStates[this.#memory.reason] : null;
  }

  #save(memory: RememberedGoodbye | null): void {
    this.#memory = memory;
    saveMacGoodbye(this.#publicKey, memory);
  }
}
