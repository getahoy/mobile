import assert from "node:assert/strict";
import { test } from "node:test";
import { voiceActivity } from "./voiceActivity.ts";

const quiet = { speaking: false, level: null };

test("listening drives the dots and cool orb from the microphone", () => {
  const view = voiceActivity({ kind: "listening" }, quiet, 0.6);
  assert.deepEqual(view, {
    dots: "level",
    tone: "listen",
    orb: "level",
    level: 0.6,
  });
});

test("idle hides the dots", () => {
  assert.equal(voiceActivity({ kind: "ready" }, quiet, 0).dots, "off");
});

test("Ahoy speaking with levels warms the orb and follows the audio", () => {
  const view = voiceActivity(
    { kind: "ready" },
    { speaking: true, level: 0.4 },
    0,
  );
  assert.equal(view.tone, "speak");
  assert.equal(view.dots, "level");
  assert.equal(view.level, 0.4);
});

test("Ahoy speaking without levels pulses gently", () => {
  const view = voiceActivity(
    { kind: "ready" },
    { speaking: true, level: null },
    0,
  );
  assert.equal(view.dots, "pulse");
  assert.equal(view.orb, "breathe");
});
