import assert from "node:assert/strict";
import { test } from "node:test";
import type { HistoryWriteEntry } from "@getahoy/protocol";
import type { TalkState } from "../talk/talkState.ts";
import { type Outbox, putEntry } from "./historyOutbox.ts";
import {
  freshTracking,
  type TalkTracking,
  trackTalk,
} from "./historyTracker.ts";

const mac = { key: "A".repeat(43), name: "Studio Mac" };
const ROOT = "6f1c8a52-3b8e-4c1f-9a2d-1b2c3d4e5f60";
const ANSWER = "0a1b2c3d-4e5f-4a6b-8c7d-8e9f0a1b2c3d";
const READY: TalkState = { kind: "ready" };

type Run = {
  tracking: TalkTracking;
  outbox: Outbox;
  before: TalkState;
  writes: HistoryWriteEntry[];
};

const start: Run = {
  tracking: freshTracking,
  outbox: {},
  before: READY,
  writes: [],
};

function play(states: readonly [TalkState, number][]): Run {
  let run = start;
  for (const [state, now] of states) {
    const { tracking, before, outbox } = run;
    const step = { tracking, before, state, now, mac, outbox };
    const tracked = trackTalk(step);
    run = {
      tracking: tracked.tracking,
      outbox: tracked.writes.reduce(putEntry, outbox),
      before: state,
      writes: [...run.writes, ...tracked.writes],
    };
  }
  return run;
}

type Answered = Extract<TalkState, { kind: "answered" }>;

const answered = (fields: Partial<Answered>): TalkState => ({
  kind: "answered",
  commandId: ROOT,
  threadId: ROOT,
  heard: "click save",
  status: "done",
  message: "Clicked Save",
  speech: null,
  choices: [],
  confirm: false,
  sentAt: 3000,
  receivedAt: 3500,
  details: { onMacMs: 400 },
  ...fields,
});

const sending = (heard: string, commandId: string): TalkState => ({
  kind: "sending",
  heard,
  slow: false,
  commandId,
});

const spoken: [TalkState, number][] = [
  [{ kind: "listening" }, 1000],
  [{ kind: "understanding" }, 2000],
  [sending("click save", ROOT), 2600],
];

const SAVE = [{ number: 1, label: "Save" }];

test("speaking writes a running entry with hearing and understanding times", () => {
  const { writes } = play(spoken);
  assert.equal(writes.length, 1);
  assert.equal(writes[0]?.status, "running");
  const timings = { hearingMs: 1000, understandingMs: 600 };
  assert.deepEqual(writes[0]?.timings, timings);
});

test("the result finishes the same entry", () => {
  const { outbox } = play([...spoken, [answered({}), 3500]]);
  assert.equal(outbox[ROOT]?.entry.status, "done");
  assert.equal(outbox[ROOT]?.entry.rev, 2);
});

test("a picked choice joins the thread and finishes it as asked first", () => {
  const asked = answered({ status: "needsChoice", choices: SAVE });
  const picked = answered({
    commandId: ANSWER,
    heard: "1",
    sentAt: 6500,
    receivedAt: 7000,
  });
  const { outbox } = play([
    ...spoken,
    [asked, 3500],
    [sending("1", ANSWER), 6500],
    [picked, 7000],
  ]);
  assert.equal(Object.keys(outbox).length, 1);
  assert.equal(outbox[ROOT]?.entry.status, "choice");
  assert.equal(outbox[ROOT]?.entry.followUps[0]?.waitedMs, 3000);
});

test("a choice left to expire ends the entry as cancelled", () => {
  const asked = answered({ status: "needsChoice", choices: SAVE });
  const { outbox } = play([...spoken, [asked, 3500], [READY, 23_500]]);
  assert.equal(outbox[ROOT]?.entry.status, "cancelled");
});

test("a Mac that never answers fails the entry with that reason", () => {
  const lost: TalkState = {
    kind: "failed",
    failure: "noAnswer",
    heard: "click save",
    commandId: ROOT,
  };
  const { outbox } = play([...spoken, [lost, 18_000]]);
  assert.equal(outbox[ROOT]?.entry.status, "failed");
  assert.equal(outbox[ROOT]?.entry.reason, "noAnswer");
});
