import assert from "node:assert/strict";
import { test } from "node:test";
import { androidFrame, frameCount, iosFrame } from "./guideTimeline.ts";

test("the iOS guide ends with the toggle on and the last step lit", () => {
  const last = iosFrame("camera", frameCount("ios") - 1);
  assert.equal(last.targetOn, true);
  assert.equal(last.activeStep, 2);
  assert.equal(last.finger.visible, false);
});

test("the iOS guide starts with the toggle off", () => {
  assert.equal(iosFrame("mic", 0).targetOn, false);
});

test("each permission targets its own Settings row", () => {
  assert.equal(iosFrame("net", 0).targetRow, 0);
  assert.equal(iosFrame("camera", 0).targetRow, 1);
  assert.equal(iosFrame("mic", 0).targetRow, 2);
});

test("the finger presses the row it points at", () => {
  const pressing = iosFrame("mic", 2);
  assert.equal(pressing.finger.pressed, true);
  assert.equal(pressing.finger.y, iosFrame("mic", 1).finger.y);
});

test("the Android guide walks App info, permissions, then the choice", () => {
  assert.equal(androidFrame(0).screen, "appInfo");
  assert.equal(androidFrame(2).screen, "permissions");
  assert.equal(androidFrame(4).screen, "choice");
});

test("the Android guide ends picked, on the last step", () => {
  const last = androidFrame(frameCount("android") - 1);
  assert.equal(last.picked, true);
  assert.equal(last.activeStep, 3);
});

test("frames loop", () => {
  assert.deepEqual(
    iosFrame("camera", frameCount("ios")),
    iosFrame("camera", 0),
  );
  assert.deepEqual(androidFrame(frameCount("android")), androidFrame(0));
});
