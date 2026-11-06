import assert from "node:assert/strict";
import { test } from "node:test";
import { promptFor, promptText } from "./promptClips.ts";

test("a reply without choices speaks its own line", () => {
  assert.equal(promptFor({ choices: 0, confirm: false }), null);
});

test("choices speak the fixed which-one prompt", () => {
  assert.equal(promptFor({ choices: 3, confirm: false }), "whichOne");
  assert.equal(promptText.whichOne, "Which one? Say the number.");
});

test("a confirm speaks the fixed confirm prompt", () => {
  assert.equal(promptFor({ choices: 1, confirm: true }), "confirm");
});
