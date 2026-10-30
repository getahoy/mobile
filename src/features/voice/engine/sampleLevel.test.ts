import assert from "node:assert/strict";
import { test } from "node:test";
import { sampleLevel } from "./sampleLevel.ts";

test("silence is zero", () => {
  assert.equal(sampleLevel([]), 0);
  assert.equal(sampleLevel([0, 0, 0]), 0);
});

test("loud audio caps at one", () => {
  assert.equal(sampleLevel([1, -1, 1, -1]), 1);
});

test("quiet audio sits in between", () => {
  const level = sampleLevel([0.1, -0.1, 0.1, -0.1]);
  assert.ok(level > 0 && level < 1);
});
