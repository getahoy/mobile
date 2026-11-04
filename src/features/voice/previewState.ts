import type { SpeakVoice } from "@getahoy/protocol";

type ActivePhase = "loading" | "playing" | "paused";

export type SamplePhase = ActivePhase | "idle";

export type PreviewState =
  | { kind: "idle" }
  | { kind: ActivePhase; voice: SpeakVoice };

export type PreviewEvent =
  | { type: "tap"; voice: SpeakVoice }
  | { type: "ready"; voice: SpeakVoice }
  | { type: "stop" };

export const IDLE: PreviewState = { kind: "idle" };

export function phaseOf(state: PreviewState, voice: SpeakVoice): SamplePhase {
  return state.kind !== "idle" && state.voice === voice ? state.kind : "idle";
}

function tapped(state: PreviewState, voice: SpeakVoice): PreviewState {
  const phase = phaseOf(state, voice);
  switch (phase) {
    case "idle":
      return { kind: "loading", voice };
    case "loading":
      return IDLE;
    case "playing":
      return { kind: "paused", voice };
    case "paused":
      return { kind: "playing", voice };
    default: {
      const unhandled: never = phase;
      return unhandled;
    }
  }
}

export function previewStep(
  state: PreviewState,
  event: PreviewEvent,
): PreviewState {
  switch (event.type) {
    case "tap":
      return tapped(state, event.voice);
    case "ready":
      return phaseOf(state, event.voice) === "loading"
        ? { kind: "playing", voice: event.voice }
        : state;
    case "stop":
      return IDLE;
    default: {
      const unhandled: never = event;
      return unhandled;
    }
  }
}
