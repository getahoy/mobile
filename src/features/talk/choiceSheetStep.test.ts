import assert from "node:assert/strict";
import { test } from "node:test";
import { choiceSheetStep } from "./choiceSheetStep.ts";
import type { TalkState } from "./talkState.ts";

const choosing: TalkState = {
  kind: "answered",
  commandId: "c",
  threadId: "t",
  heard: "save this",
  status: "needsChoice",
  message: "3 things match save",
  speech: null,
  choices: [{ number: 1, label: "Save" }],
  confirm: false,
  sentAt: 0,
  receivedAt: 0,
};
const ready: TalkState = { kind: "ready" };

test("new choices open the sheet", () => {
  assert.equal(choiceSheetStep("ready", choosing, false), "show");
});

test("choices timing out expire the sheet", () => {
  assert.equal(choiceSheetStep("answered", ready, false), "expire");
});

test("answering by voice keeps the sheet open", () => {
  assert.equal(
    choiceSheetStep("answered", { kind: "listening" }, false),
    "keep",
  );
  assert.equal(
    choiceSheetStep("listening", { kind: "understanding" }, false),
    "keep",
  );
  assert.equal(choiceSheetStep("listening", ready, false), "keep");
});

test("picking or dismissing closes instead of expiring", () => {
  assert.equal(choiceSheetStep("answered", ready, true), "close");
});

test("a plain result or a failure closes the sheet", () => {
  const done: TalkState = { ...choosing, status: "done", choices: [] };
  const failed: TalkState = {
    kind: "failed",
    failure: "noAnswer",
    heard: null,
  };
  assert.equal(choiceSheetStep("sending", done, false), "close");
  assert.equal(choiceSheetStep("sending", failed, false), "close");
});
