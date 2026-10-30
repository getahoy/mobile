import assert from "node:assert/strict";
import { test } from "node:test";
import { talkCopy } from "./copy/talkCopy.ts";
import { talkBarView } from "./talkBarView.ts";

const MAC = "Studio Mac";
const ready = {
  state: { kind: "ready" },
  block: null,
  access: "granted",
  mac: MAC,
  durationMs: 0,
} as const;

test("idle bar invites a hold", () => {
  const bar = talkBarView(ready);
  assert.equal(bar.label, talkCopy.holdToTalk);
  assert.equal(bar.disabled, false);
});

test("listening shows a timer", () => {
  const bar = talkBarView({
    ...ready,
    state: { kind: "listening" },
    durationMs: 4000,
  });
  assert.equal(bar.label, talkCopy.listening(4000));
  assert.equal(bar.labelStyle, "timer");
});

test("a slow send says to check the Mac", () => {
  const state = { kind: "sending", heard: "open notes", slow: true } as const;
  const bar = talkBarView({ ...ready, state });
  assert.equal(bar.label, talkCopy.checkMac);
});

test("a blocked Mac disables the bar with its reason", () => {
  const bar = talkBarView({ ...ready, block: "paused" });
  assert.equal(bar.disabled, true);
  assert.equal(bar.reason, talkCopy.paused(MAC));
});

test("a blocked microphone wins over the Mac reason", () => {
  const bar = talkBarView({ ...ready, block: "locked", access: "blocked" });
  assert.equal(bar.reason, talkCopy.micBlocked);
});
