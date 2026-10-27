import assert from "node:assert/strict";
import { test } from "node:test";
import { voiceLevel } from "./voiceLevel.ts";

test("room noise stays at zero", () => {
  assert.equal(voiceLevel(-48), 0);
  assert.equal(voiceLevel(undefined), 0);
});

test("soft speech starts to show", () => {
  assert.ok(Math.abs(voiceLevel(-35) - 0.29) < 0.01);
});

test("normal speech fills over half", () => {
  assert.ok(Math.abs(voiceLevel(-25) - 0.57) < 0.01);
});

test("loud speech is full and never more", () => {
  assert.equal(voiceLevel(-10), 1);
  assert.equal(voiceLevel(0), 1);
});
