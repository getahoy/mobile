import type { TalkState } from "./talkState.ts";

export type SheetStep = "show" | "keep" | "expire" | "close";

const ANSWERING: readonly TalkState["kind"][] = [
  "listening",
  "understanding",
  "sending",
  "tooShort",
];

export function choiceSheetStep(
  previous: TalkState["kind"],
  state: TalkState,
  leaving: boolean,
): SheetStep {
  if (state.kind === "answered" && state.choices.length > 0) return "show";
  if (leaving) return "close";
  if (state.kind === "ready")
    return previous === "answered" ? "expire" : "keep";
  return ANSWERING.includes(state.kind) ? "keep" : "close";
}
