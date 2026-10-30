import assert from "node:assert/strict";
import { test } from "node:test";
import { nextSessionGate } from "./sessionGate.ts";

test("the first load waits, then shows signing in, then opens", () => {
  assert.equal(nextSessionGate("waiting", true, false), "waiting");
  assert.equal(nextSessionGate("waiting", true, true), "signingIn");
  assert.equal(nextSessionGate("signingIn", false, false), "ready");
});

test("once ready, a later pending check never closes the app again", () => {
  const ready = nextSessionGate("waiting", false, false);
  assert.equal(ready, "ready");
  assert.equal(nextSessionGate(ready, true, false), "ready");
  assert.equal(nextSessionGate(ready, true, true), "ready");
});
