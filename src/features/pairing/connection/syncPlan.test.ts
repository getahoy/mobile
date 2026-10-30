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
    ended: null,
  };
}

function endedMac(publicKey: string): PairedMac {
  return { ...mac(publicKey), ended: { reason: "removed", at: 0 } };
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

test("ended Macs stop and never start", () => {
  const plan = syncPlan(["a"], [endedMac("a"), endedMac("c")]);
  assert.deepEqual(keys(plan.start), []);
  assert.deepEqual(plan.stop, ["a"]);
});

test("running Macs are left alone", () => {
  const plan = syncPlan(["a"], [mac("a"), mac("b")]);
  assert.deepEqual(keys(plan.start), ["b"]);
  assert.deepEqual(plan.stop, []);
});
