import assert from "node:assert/strict";
import { test } from "node:test";
import { noThreads, type ThreadEvent, threadReducer } from "./threadStore.ts";

const ROOT = "root";

const result = (overrides: Partial<ThreadEvent> = {}): ThreadEvent => ({
  kind: "result",
  commandId: ROOT,
  threadId: ROOT,
  heard: "click save",
  message: "More than one Save on the screen. Pick a number.",
  status: "needsChoice",
  asks: true,
  durationMs: 800,
  ...overrides,
});

test("a question opens a thread with the prompt and Ahoy's line", () => {
  const { current } = threadReducer(noThreads, result());
  assert.equal(current?.status, "open");
  assert.deepEqual(
    current?.lines.map((line) => line.speaker),
    ["you", "ahoy"],
  );
});

test("an answer in the same thread folds under it and finishes it", () => {
  const opened = threadReducer(noThreads, result());
  const answered = threadReducer(
    opened,
    result({
      commandId: "answer",
      heard: "two",
      message: "Clicked Save",
      status: "done",
      asks: false,
    }),
  );
  assert.equal(answered.current?.status, "done");
  assert.equal(answered.current?.rounds, 1);
  assert.equal(answered.current?.lines.length, 4);
});

test("a new command replaces an open thread", () => {
  const opened = threadReducer(noThreads, result());
  const next = threadReducer(
    opened,
    result({ commandId: "new", threadId: "new", heard: "open spotify" }),
  );
  assert.equal(next.current?.threadId, "new");
  assert.equal(next.replaced?.status, "replaced");
});

test("an open thread can expire, a finished one cannot", () => {
  const opened = threadReducer(noThreads, result());
  const expired = threadReducer(opened, { kind: "expired", threadId: ROOT });
  assert.equal(expired.current?.status, "expired");
  const finished = result({ status: "done", asks: false });
  const done = threadReducer(noThreads, finished);
  const still = threadReducer(done, { kind: "expired", threadId: ROOT });
  assert.equal(still.current?.status, "done");
});
