import assert from "node:assert/strict";
import { test } from "node:test";
import {
  applyAnswer,
  cancelRecord,
  failRecord,
  historyStatusOf,
  type MacAnswer,
  startRecord,
} from "./historyRecords.ts";

const START = Date.parse("2026-11-07T10:00:00.000Z");

const running = startRecord({
  id: "6f1c8a52-3b8e-4c1f-9a2d-1b2c3d4e5f60",
  mac: { key: "A".repeat(43), name: "Studio Mac" },
  heard: "click save",
  startedAt: START,
  hearingMs: 900,
  understandingMs: 400,
});

const answer = (fields: Partial<MacAnswer>): MacAnswer => ({
  heard: "click save",
  status: "done",
  message: "Clicked Save",
  choices: [],
  details: { app: "Pages", via: "rules", onMacMs: 300 },
  waitedMs: null,
  at: START + 2000,
  ...fields,
});

const CHOICES = [
  { number: 1, label: "Save" },
  { number: 2, label: "Save As" },
];

const asking = answer({
  status: "needsChoice",
  message: "Which one?",
  choices: CHOICES,
});

test("the Mac's statuses map to history statuses", () => {
  assert.equal(historyStatusOf("done", false), "done");
  assert.equal(historyStatusOf("done", true), "choice");
  assert.equal(historyStatusOf("needsChoice", false), "running");
  assert.equal(historyStatusOf("refused", false), "blocked");
  assert.equal(historyStatusOf("failed", true), "failed");
});

test("a new record runs with the phone's stage times and revision one", () => {
  assert.equal(running.status, "running");
  assert.equal(running.rev, 1);
  assert.equal(running.finishedAt, null);
  assert.deepEqual(running.timings, { hearingMs: 900, understandingMs: 400 });
});

test("a result finishes the record with what the Mac said and did", () => {
  const done = applyAnswer(running, answer({}));
  assert.equal(done.status, "done");
  assert.equal(done.rev, 2);
  assert.equal(done.did, "Clicked Save");
  assert.equal(done.app, "Pages");
  assert.equal(done.via, "rules");
  assert.equal(done.reason, null);
  assert.equal(done.timings.onMacMs, 300);
  assert.equal(done.finishedAt, "2026-11-07T10:00:02.000Z");
});

test("failed and refused results keep the Mac's reason or say other", () => {
  const missing = { onMacMs: 10, reason: "targetNotFound" as const };
  const failed = answer({ status: "failed", details: missing });
  assert.equal(applyAnswer(running, failed).reason, "targetNotFound");
  const refused = applyAnswer(running, answer({ status: "refused" }));
  assert.equal(refused.status, "blocked");
  assert.equal(refused.reason, "other");
});

test("a follow-up keeps the record running, then the answer finishes it as asked first", () => {
  const asked = applyAnswer(running, asking);
  assert.equal(asked.status, "running");
  assert.equal(asked.finishedAt, null);
  assert.equal(asked.followUps.length, 1);
  const pick = answer({ heard: "2", message: "Saved as", waitedMs: 3000 });
  const picked = applyAnswer(asked, pick);
  assert.equal(picked.status, "choice");
  assert.deepEqual(picked.followUps[0], {
    question: "Which one?",
    options: CHOICES,
    chosen: 2,
    said: "2",
    waitedMs: 3000,
  });
  assert.equal(picked.timings.waitedMs, 3000);
  assert.equal(picked.timings.onMacMs, 600);
});

test("a spoken answer is kept as said with no number chosen", () => {
  const asked = applyAnswer(running, asking);
  const said = answer({ heard: "the first one", waitedMs: 1500 });
  const spoken = applyAnswer(asked, said);
  assert.equal(spoken.followUps[0]?.chosen, null);
  assert.equal(spoken.followUps[0]?.said, "the first one");
});

test("a talk failure after sending finishes the record with its reason", () => {
  const unreachable = failRecord(running, "macUnreachable", START + 5000);
  assert.equal(unreachable.status, "failed");
  assert.equal(unreachable.reason, "macUnreachable");
  assert.equal(unreachable.rev, 2);
  assert.equal(failRecord(running, "rateLimited", START).reason, "other");
});

test("cancelling ends the record without a reason", () => {
  const cancelled = cancelRecord(running, START + 20_000);
  assert.equal(cancelled.status, "cancelled");
  assert.equal(cancelled.reason, null);
  assert.equal(cancelled.finishedAt, "2026-11-07T10:00:20.000Z");
});
