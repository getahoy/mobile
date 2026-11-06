import assert from "node:assert/strict";
import { test } from "node:test";
import { MAX_HISTORY_WRITES } from "@getahoy/protocol";
import {
  cancelRunning,
  entryOf,
  markSent,
  type Outbox,
  pendingBatch,
  putEntry,
  unsyncedIds,
} from "./historyOutbox.ts";
import { applyAnswer, startRecord } from "./historyRecords.ts";

const START = Date.parse("2026-11-07T10:00:00.000Z");
const mac = { key: "A".repeat(43), name: "Studio Mac" };

const recordAt = (index: number) =>
  startRecord({
    id: `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
    mac,
    heard: `command ${index}`,
    startedAt: START + index * 1000,
    hearingMs: 500,
    understandingMs: 300,
  });

const done = (index: number) =>
  applyAnswer(recordAt(index), {
    heard: `command ${index}`,
    status: "done",
    message: "Done",
    choices: [],
    details: {},
    waitedMs: null,
    at: START + index * 1000 + 500,
  });

const empty: Outbox = {};

test("an unsent entry stays pending, so a failed or offline flush retries it", () => {
  const outbox = putEntry(empty, recordAt(1));
  assert.equal(pendingBatch(outbox).length, 1);
  assert.equal(pendingBatch(outbox).length, 1);
  assert.deepEqual([...unsyncedIds(outbox)], [recordAt(1).id]);
});

test("a finished entry stops being pending once the server has it; marking twice changes nothing", () => {
  const outbox = putEntry(empty, done(1));
  const revision = [{ id: done(1).id, rev: done(1).rev }];
  const sent = markSent(outbox, revision);
  assert.equal(pendingBatch(sent).length, 0);
  assert.deepEqual(markSent(sent, revision), sent);
  assert.equal(entryOf(sent, done(1).id)?.status, "done");
});

const doneUpTo = (count: number) =>
  Array.from({ length: count }, (_, index) => done(index + 1));

const firstSent = () =>
  markSent(putEntry(empty, recordAt(1)), [{ id: recordAt(1).id, rev: 1 }]);

test("only the newest fifty settled entries are kept", () => {
  const outbox = doneUpTo(60).reduce(putEntry, empty);
  const everything = Object.values(outbox).map(({ entry }) => entry);
  const sent = markSent(outbox, everything);
  assert.equal(Object.keys(sent).length, 50);
  assert.equal(entryOf(sent, done(1).id), null);
  assert.equal(entryOf(sent, done(60).id)?.status, "done");
});

test("a newer revision written during a flush stays pending", () => {
  const started = putEntry(empty, recordAt(1));
  const batch = pendingBatch(started);
  const finished = putEntry(started, done(1));
  const sent = markSent(finished, batch);
  assert.equal(pendingBatch(sent)[0]?.status, "done");
});

test("a running entry the server has stays so it can still be finished", () => {
  const outbox = firstSent();
  assert.equal(pendingBatch(outbox).length, 0);
  assert.equal(entryOf(outbox, recordAt(1).id)?.status, "running");
});

test("one flush sends at most twenty entries, oldest first", () => {
  const outbox = doneUpTo(25).reverse().reduce(putEntry, empty);
  const batch = pendingBatch(outbox);
  assert.equal(batch.length, MAX_HISTORY_WRITES);
  assert.equal(batch[0]?.id, done(1).id);
});

test("on relaunch every running entry is finished as cancelled and sent again", () => {
  const withDone = putEntry(firstSent(), done(2));
  const relaunched = cancelRunning(withDone, START + 60_000);
  const cancelled = relaunched[recordAt(1).id]?.entry;
  assert.equal(cancelled?.status, "cancelled");
  assert.equal(cancelled?.rev, 2);
  assert.equal(relaunched[done(2).id]?.entry.status, "done");
  assert.equal(pendingBatch(relaunched).length, 2);
});
