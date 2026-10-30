import assert from "node:assert/strict";
import { test } from "node:test";
import { talkView } from "./talkView.ts";
import type { Thread } from "./threads/threadStore.ts";

const MAC = "Studio Mac";

const answeredChoice: Thread = {
  threadId: "t",
  status: "done",
  rounds: 2,
  lines: [
    { id: "1", speaker: "you", text: "save this" },
    { id: "2", speaker: "ahoy", text: "Which one?" },
    { id: "3", speaker: "you", text: "2" },
    { id: "4", speaker: "ahoy", text: "Clicked Save As in Pages." },
  ],
};

test("a finished thread folds into its last reply and one follow-up line", () => {
  const { heard, reply } = talkView({ kind: "ready" }, answeredChoice, MAC);
  assert.equal(heard, "save this");
  assert.equal(reply?.message, "Clicked Save As in Pages.");
  assert.equal(reply?.followUp, "Which one? · 2");
  assert.equal(reply?.tone, "done");
});

test("a retryable failure offers try again and keeps what was heard", () => {
  const state = {
    kind: "failed",
    failure: "noAnswer",
    heard: "open the invoices folder",
  } as const;
  const { heard, reply } = talkView(state, null, MAC);
  assert.equal(heard, "open the invoices folder");
  assert.equal(reply?.tone, "failed");
  assert.equal(reply?.retry, true);
});

test("nothing heard yet shows neither line nor card", () => {
  assert.deepEqual(talkView({ kind: "ready" }, null, MAC), {
    heard: null,
    reply: null,
  });
});
