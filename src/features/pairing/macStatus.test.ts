import assert from "node:assert/strict";
import { test } from "node:test";
import type { MacLinkState } from "./connection/macLinkState.ts";
import { macCopy } from "./copy/macCopy.ts";
import { type MacStatus, macStatus } from "./macStatus.ts";

const MAC = "Studio Mac";
const { chip } = macCopy;

const quiet = (label: string, message: string): MacStatus => ({
  chip: label,
  tone: "quiet",
  message,
});

const expected: readonly (readonly [MacLinkState, MacStatus])[] = [
  [
    { kind: "connecting" },
    { chip: chip.connecting, tone: "connecting", message: null },
  ],
  [
    { kind: "connected", locked: false },
    { chip: chip.connected, tone: "connected", message: null },
  ],
  [
    { kind: "connected", locked: true },
    quiet(chip.locked, macCopy.locked(MAC)),
  ],
  [{ kind: "paused" }, quiet(chip.paused, macCopy.paused)],
  [{ kind: "macOff" }, quiet(chip.off, macCopy.macOff(MAC))],
  [{ kind: "macQuit" }, quiet(chip.notRunning, macCopy.macQuit(MAC))],
  [{ kind: "macAsleep" }, quiet(chip.asleep, macCopy.macAsleep(MAC))],
  [
    { kind: "unreachable", onCellular: false },
    quiet(chip.cantReach, macCopy.notFound(MAC)),
  ],
  [
    { kind: "unreachable", onCellular: true },
    quiet(chip.mobileData, macCopy.cellular(MAC)),
  ],
  [{ kind: "macTooOld" }, quiet(chip.updateNeeded, macCopy.macTooOld)],
  [{ kind: "macTooNew" }, quiet(chip.updateNeeded, macCopy.macTooNew)],
  [
    { kind: "unrecognised" },
    quiet(chip.notRecognised, macCopy.unrecognised(MAC)),
  ],
];

test("every link state has its chip, tone and message", () => {
  for (const [state, status] of expected) {
    assert.deepEqual(macStatus(state, MAC), status, JSON.stringify(state));
  }
});
