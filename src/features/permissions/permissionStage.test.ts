import assert from "node:assert/strict";
import { test } from "node:test";
import { permissionStage } from "./permissionStage.ts";

test("never asked shows the explainer first", () => {
  const stage = permissionStage({
    granted: false,
    asked: false,
    canAskAgain: true,
  });
  assert.equal(stage, "explainer");
});

test("a first no that can be asked again offers the popup once more", () => {
  const stage = permissionStage({
    granted: false,
    asked: true,
    canAskAgain: true,
  });
  assert.equal(stage, "again");
});

test("a no that cannot be asked again sends people to Settings", () => {
  const stage = permissionStage({
    granted: false,
    asked: true,
    canAskAgain: false,
  });
  assert.equal(stage, "guide");
});

test("granted wins over everything else", () => {
  const stage = permissionStage({
    granted: true,
    asked: true,
    canAskAgain: false,
  });
  assert.equal(stage, "granted");
});
