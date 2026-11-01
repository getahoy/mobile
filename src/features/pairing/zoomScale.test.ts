import assert from "node:assert/strict";
import { test } from "node:test";
import {
  clampZoomLevel,
  dragZoomLevel,
  nextZoomLevel,
  pinchZoomLevel,
  zoomLimitReached,
} from "./zoomScale.ts";

const SIXTH = 1 / 6;
const NEAR = 1e-9;

test("steps move to the next sixth and stop at the ends", () => {
  assert.equal(nextZoomLevel(0, "in"), SIXTH);
  assert.equal(nextZoomLevel(1, "in"), 1);
  assert.equal(nextZoomLevel(0, "out"), 0);
});

test("a step from between stops lands on the next stop", () => {
  assert.equal(nextZoomLevel(0.2, "in"), 2 * SIXTH);
  assert.equal(nextZoomLevel(0.2, "out"), SIXTH);
});

test("limits are reached at both ends only", () => {
  assert.equal(zoomLimitReached(1, "in"), true);
  assert.equal(zoomLimitReached(0, "out"), true);
  assert.equal(zoomLimitReached(0.5, "in"), false);
  assert.equal(zoomLimitReached(0.5, "out"), false);
});

test("a pinch that ends at scale 1 keeps the level on both curves", () => {
  for (const curve of ["exponential", "linear"] as const) {
    assert.ok(Math.abs(pinchZoomLevel(0.5, 1, curve) - 0.5) < NEAR);
  }
});

test("a full pinch out never goes below zero", () => {
  assert.equal(pinchZoomLevel(0.5, 0, "linear"), 0);
  assert.equal(pinchZoomLevel(0.5, 0, "exponential"), 0);
});

test("dragging up by half the track zooms in by half", () => {
  assert.equal(dragZoomLevel(0, -50, 100), 0.5);
  assert.equal(dragZoomLevel(0.3, -50, 0), 0.3);
});

test("bad levels clamp into range", () => {
  assert.equal(clampZoomLevel(Number.NaN), 0);
  assert.equal(clampZoomLevel(2), 1);
  assert.equal(clampZoomLevel(-1), 0);
});
