export const PROMPT_CLIPS = ["whichOne", "confirm"] as const;

export type PromptClip = (typeof PROMPT_CLIPS)[number];

// The same lines are recorded per voice by web/scripts/buildVoiceSamples.ts --prompts.
export const promptText: Record<PromptClip, string> = {
  whichOne: "Which one? Say the number.",
  confirm: "Tap the button on your phone to go ahead.",
};

type Asking = { choices: number; confirm: boolean };

export function promptFor({ choices, confirm }: Asking): PromptClip | null {
  if (choices === 0) return null;
  return confirm ? "confirm" : "whichOne";
}
