import assert from "node:assert/strict";
import { test } from "node:test";
import type { PairedMac } from "../storage/pairedMacs.ts";
import { syncPlan } from "./syncPlan.ts";

function mac(publicKey: string): PairedMac {
  return {
    publicKey,
    displayName: publicKey,
    lastKnownAddresses: [],
    lanPort: null,
    pairedAt: 0,
    paused: false,
  };
}

const keys = (macs: readonly PairedMac[]) => macs.map((m) => m.publicKey);

test("new Macs start", () => {
  const plan = syncPlan([], [mac("a"), mac("b")]);
  assert.deepEqual(keys(plan.start), ["a", "b"]);
  assert.deepEqual(plan.stop, []);
});

test("removed Macs stop", () => {
  const plan = syncPlan(["a", "b"], [mac("a")]);
  assert.deepEqual(keys(plan.start), []);
  assert.deepEqual(plan.stop, ["b"]);
});

test("running Macs are left alone", () => {
  const plan = syncPlan(["a"], [mac("a"), mac("b")]);
  assert.deepEqual(keys(plan.start), ["b"]);
  assert.deepEqual(plan.stop, []);
});
