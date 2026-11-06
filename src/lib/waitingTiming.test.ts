import assert from "node:assert/strict";
import { test } from "node:test";
import {
  hideAfterMs,
  isSlow,
  SLOW_AFTER_MS,
  showsSpinner,
} from "./waitingTiming.ts";

test("a load that ends under 300 ms never shows the spinner", () => {
  assert.equal(showsSpinner(0), false);
  assert.equal(showsSpinner(299), false);
  assert.equal(showsSpinner(300), true);
});

test("a shown spinner stays at least 500 ms", () => {
  assert.equal(hideAfterMs(0), 500);
  assert.equal(hideAfterMs(120), 380);
  assert.equal(hideAfterMs(500), 0);
  assert.equal(hideAfterMs(2000), 0);
});

test("the slow line appears after 6 s", () => {
  assert.equal(isSlow(5999, SLOW_AFTER_MS), false);
  assert.equal(isSlow(6000, SLOW_AFTER_MS), true);
});
