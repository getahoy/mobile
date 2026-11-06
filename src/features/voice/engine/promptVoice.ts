import { logger } from "@/features/logging/logger";
import { type PromptClip, promptText } from "../promptClips";
import { playSource } from "./audioPlayback";
import { deviceVoice } from "./deviceVoice";
import {
  choosePlayable,
  locatePreview,
  type SpeechFetches,
} from "./previewAudio";
import type { SpeakOptions } from "./voiceEngine";

// Fixed prompts ship recorded, so a question back always sounds like the chosen voice.
// A changed voice id fetches and caches the line once; only offline falls to the device.
export async function speakPrompt(
  clip: PromptClip,
  { voice, signal, onLevel }: SpeakOptions,
  fetches: SpeechFetches,
): Promise<void> {
  const text = promptText[clip];
  const playable = await choosePlayable(text, voice, fetches).catch(
    () => ({ kind: "device" }) as const,
  );
  if (signal.aborted) return;
  if (__DEV__) logger.info("voice", `Prompt ${clip} from ${playable.kind}`);
  if (playable.kind === "audio") {
    return playSource(playable.source, signal, onLevel);
  }
  return deviceVoice.speak(text, { voice, signal });
}

export function warmPrompts(
  voice: SpeakOptions["voice"],
  fetches: SpeechFetches,
): void {
  for (const text of Object.values(promptText)) {
    void locatePreview(text, voice)
      .then(({ key, source }) => {
        if (source.kind === "fetch") fetches.warm(key, text, voice);
      })
      .catch(() => undefined);
  }
}
