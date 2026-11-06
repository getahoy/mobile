import assert from "node:assert/strict";
import { test } from "node:test";
import { blankFor, waitsForFirstLoad } from "./historyBlankState.ts";

test("only a first load with nothing cached or waiting shows the waiting state", () => {
  assert.equal(waitsForFirstLoad({ phase: "loading", count: 0 }), true);
  assert.equal(waitsForFirstLoad({ phase: "loading", count: 3 }), false);
  assert.equal(waitsForFirstLoad({ phase: "ready", count: 0 }), false);
  assert.equal(waitsForFirstLoad({ phase: "failed", count: 0 }), false);
});

test("a failed first load shows could not load", () => {
  const input = {
    cleared: false,
    count: 0,
    filter: "all" as const,
    search: "",
  };
  assert.equal(blankFor({ ...input, phase: "failed" }), "error");
  assert.equal(blankFor({ ...input, phase: "ready" }), "empty");
});
