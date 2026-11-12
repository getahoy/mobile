import assert from "node:assert/strict";
import { test } from "node:test";
import { endedWhen, endPairing, settleEndedMacs } from "./endedPairing.ts";

const studio = { publicKey: "a", displayName: "Studio Mac", ended: null };
const laptop = { publicKey: "b", displayName: "Laptop", ended: null };
const AT = 1_000_000;
const ending = { reason: "removed", at: AT, whileClosed: false } as const;
const MINUTE = 60_000;

test("an ended Mac leaves the list and leaves a notice", () => {
  const ended = endPairing([studio, laptop], "a", ending);
  assert.deepEqual(ended?.macs, [laptop]);
  assert.deepEqual(ended?.notice, { deviceName: "Studio Mac", ...ending });
});

test("an end for a Mac no longer paired is ignored", () => {
  assert.equal(endPairing([laptop], "a", ending), null);
});

test("the side that removed the Mac itself gets no notice later", () => {
  const afterOwnRemoval = [laptop];
  const late = { ...ending, reason: "signed_out" } as const;
  assert.equal(endPairing(afterOwnRemoval, studio.publicKey, late), null);
});

test("old ended records migrate and the newest one wins", () => {
  const older = { ...studio, ended: { reason: "removed" as const, at: 10 } };
  const newer = {
    ...laptop,
    ended: { reason: "signed_out" as const, at: 20 },
  };
  const live = { publicKey: "c", displayName: "Mini", ended: null };
  const settled = settleEndedMacs([older, live, newer]);
  assert.deepEqual(settled?.macs, [live]);
  assert.deepEqual(settled?.notice, {
    deviceName: "Laptop",
    reason: "signed_out",
    at: 20,
    whileClosed: false,
  });
});

test("a list with nothing ended needs no migration", () => {
  assert.equal(settleEndedMacs([studio, laptop]), null);
});

test("the eyebrow says while Ahoy was closed only when known", () => {
  const notice = { deviceName: "Studio Mac", ...ending };
  const later = AT + 125 * MINUTE;
  assert.equal(endedWhen(notice, later), "2 hours ago");
  assert.equal(
    endedWhen({ ...notice, whileClosed: true }, later),
    "2 hours ago · while Ahoy was closed",
  );
  assert.equal(endedWhen(notice, AT), "Just now");
});
