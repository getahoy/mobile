import assert from "node:assert/strict";
import { test } from "node:test";
import { touchCache } from "./cacheOrder.ts";

test("a new phrase goes last and the oldest is evicted past the limit", () => {
  assert.deepEqual(touchCache(["a", "b"], "c", 2), {
    order: ["b", "c"],
    evicted: ["a"],
  });
});

test("using a cached phrase moves it last without evicting", () => {
  assert.deepEqual(touchCache(["a", "b", "c"], "a", 3), {
    order: ["b", "c", "a"],
    evicted: [],
  });
});
