import assert from "node:assert/strict";
import { test } from "node:test";
import { type ReplyFacts, replyAction, STALE_REPLY_MS } from "./replyAction.ts";

const facts: ReplyFacts = {
  status: "done",
  asks: false,
  playsOn: "phone",
  policy: "problems",
  ageMs: 0,
  recording: false,
  screenReader: false,
};

test("by default a success chimes and a question or problem speaks", () => {
  assert.equal(replyAction(facts), "chime");
  assert.equal(replyAction({ ...facts, asks: true }), "speak");
  assert.equal(replyAction({ ...facts, status: "failed" }), "speak");
  assert.equal(replyAction({ ...facts, status: "refused" }), "speak");
});

test("everything speaks successes too, off keeps quiet", () => {
  assert.equal(replyAction({ ...facts, policy: "everything" }), "speak");
  assert.equal(replyAction({ ...facts, policy: "off", asks: true }), "quiet");
});

test("old, mid-recording or Mac-only replies stay quiet", () => {
  const old = { ...facts, asks: true, ageMs: STALE_REPLY_MS + 1 };
  assert.equal(replyAction(old), "quiet");
  assert.equal(replyAction({ ...facts, asks: true, recording: true }), "quiet");
  assert.equal(replyAction({ ...facts, asks: true, playsOn: "mac" }), "quiet");
  assert.equal(replyAction({ ...facts, asks: true, playsOn: "both" }), "speak");
});

test("with a screen reader the reply is announced, never our voice", () => {
  const reader = { ...facts, screenReader: true };
  assert.equal(replyAction({ ...reader, asks: true }), "announce");
  assert.equal(replyAction(reader), "announce");
});
