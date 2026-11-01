import type { MacLinkState } from "./connection/macLinkState";
import { macCopy } from "./copy/macCopy.ts";

export type MacTone = "connected" | "connecting" | "quiet";

export type MacStatus = {
  chip: string;
  tone: MacTone;
  message: string | null;
};

export function statusLine(status: MacStatus): string {
  if (status.message) return status.message;
  return status.tone === "connecting" ? macCopy.connecting : macCopy.connected;
}

function quiet(chip: string, message: string): MacStatus {
  return { chip, tone: "quiet", message };
}

export function macStatus(state: MacLinkState, mac: string): MacStatus {
  const { chip } = macCopy;
  switch (state.kind) {
    case "connecting":
      return { chip: chip.connecting, tone: "connecting", message: null };
    case "connected":
      if (state.locked) return quiet(chip.locked, macCopy.locked(mac));
      return { chip: chip.connected, tone: "connected", message: null };
    case "paused":
      return quiet(chip.paused, macCopy.paused);
    case "macOff":
      return quiet(chip.off, macCopy.macOff(mac));
    case "macQuit":
      return quiet(chip.notRunning, macCopy.macQuit(mac));
    case "macAsleep":
      return quiet(chip.asleep, macCopy.macAsleep(mac));
    case "unreachable":
      return state.onCellular
        ? quiet(chip.mobileData, macCopy.cellular(mac))
        : quiet(chip.cantReach, macCopy.notFound(mac));
    case "macTooOld":
      return quiet(chip.updateNeeded, macCopy.macTooOld);
    case "macTooNew":
      return quiet(chip.updateNeeded, macCopy.macTooNew);
    case "unrecognised":
      return quiet(chip.notRecognised, macCopy.unrecognised(mac));
    default: {
      const unhandled: never = state;
      return unhandled;
    }
  }
}
