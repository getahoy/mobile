import assert from "node:assert/strict";
import { test } from "node:test";
import type { MacLinkState } from "./connection/macLinkState.ts";
import { isLinkBlip, LINK_BLIP_MS } from "./steadyLinkState.ts";

const connected: MacLinkState = { kind: "connected", locked: false };
const connecting: MacLinkState = { kind: "connecting" };

test("a drop from connected is held back for a moment", () => {
  assert.equal(
    isLinkBlip(connected, { kind: "unreachable", onCellular: false }),
    true,
  );
  assert.equal(isLinkBlip(connected, connecting), true);
  assert.equal(LINK_BLIP_MS, 1500);
});

test("connecting on first launch shows at once", () => {
  assert.equal(isLinkBlip(connecting, connecting), false);
});

test("deliberate states never wait", () => {
  assert.equal(isLinkBlip(connected, { kind: "paused" }), false);
  assert.equal(isLinkBlip(connected, { kind: "unrecognised" }), false);
  assert.equal(
    isLinkBlip(connected, { kind: "connected", locked: true }),
    false,
  );
});
