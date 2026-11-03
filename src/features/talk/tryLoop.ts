export type TryFrame = { index: number; shown: number; delayMs: number };

export type WordPhase = "hidden" | "shown" | "leaving";

const FIRST_WORD_DELAY_MS = 400;
const WORD_GAP_MS = 160;
const HOLD_MS = 2600;
const LEAVE_MS = 520;

export function tryWords(example: string): string[] {
  return example.split(" ");
}

export function firstTryFrame(): TryFrame {
  return { index: 0, shown: 0, delayMs: FIRST_WORD_DELAY_MS };
}

export function wholeTryFrame(
  index: number,
  examples: readonly string[],
): TryFrame {
  const example = examples[index] ?? "";
  return { index, shown: tryWords(example).length, delayMs: 0 };
}

export function nextTryFrame(
  frame: TryFrame,
  examples: readonly string[],
): TryFrame {
  const count = tryWords(examples[frame.index] ?? "").length;
  if (frame.shown < count) {
    const shown = frame.shown + 1;
    return {
      index: frame.index,
      shown,
      delayMs: shown === count ? HOLD_MS : WORD_GAP_MS,
    };
  }
  if (frame.shown === count) {
    return { index: frame.index, shown: count + 1, delayMs: LEAVE_MS };
  }
  return {
    index: (frame.index + 1) % examples.length,
    shown: 0,
    delayMs: WORD_GAP_MS,
  };
}

export function wordPhase(
  frame: TryFrame,
  wordIndex: number,
  wordCount: number,
): WordPhase {
  if (frame.shown > wordCount) return "leaving";
  return wordIndex < frame.shown ? "shown" : "hidden";
}
