import type { PromptLine } from "@getahoy/protocol";

export const PROMPT_CLIPS = [
  "whichOne",
  "confirm",
] as const satisfies readonly PromptLine[];

type Asking = { choices: number; confirm: boolean };

export function promptFor({ choices, confirm }: Asking): PromptLine | null {
  if (choices === 0) return null;
  return confirm ? "confirm" : "whichOne";
}
