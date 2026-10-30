import assert from "node:assert/strict";
import { test } from "node:test";
import { cn } from "./cn.ts";

test("a colour and a custom text size both survive a merge", () => {
  assert.equal(
    cn("text-ink text-body", "text-on-ink"),
    "text-body text-on-ink",
  );
});

test("a later custom text size replaces an earlier one", () => {
  assert.equal(cn("text-body text-ink", "text-title"), "text-ink text-title");
});

test("custom fonts and radii replace their own kind only", () => {
  assert.equal(
    cn("font-sans rounded-full text-body", "font-sans-medium rounded-card"),
    "text-body font-sans-medium rounded-card",
  );
});
