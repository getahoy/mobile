import type { MacLinkState } from "../pairing/connection/macLinkState.ts";
import type { TalkBlock } from "./talkState.ts";

// Connecting is not a block: recording starts at once and the send waits for the link.
export function talkBlockOf(state: MacLinkState): TalkBlock | null {
  switch (state.kind) {
    case "connecting":
      return null;
    case "connected":
      return state.locked ? "locked" : null;
    case "paused":
      return "paused";
    case "macOff":
    case "macAsleep":
    case "macQuit":
    case "unreachable":
    case "unrecognised":
    case "macTooOld":
    case "macTooNew":
      return "noMac";
    default: {
      const unhandled: never = state;
      return unhandled;
    }
  }
}
