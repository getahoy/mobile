import type { SpeakVoice } from "@getahoy/protocol";
import * as Speech from "expo-speech";
import type { SpeakOptions, VoiceEngine } from "./voiceEngine";

const INDIAN_ENGLISH = "en-IN";
const ENGLISH = "en";

async function bestVoice(voice: SpeakVoice): Promise<string | undefined> {
  const voices = await Speech.getAvailableVoicesAsync().catch(() => []);
  const wanted = voice === "india" ? INDIAN_ENGLISH : ENGLISH;
  const fitting = voices.filter((candidate) =>
    candidate.language.startsWith(wanted),
  );
  const enhanced = fitting.find(
    (candidate) => candidate.quality === Speech.VoiceQuality.Enhanced,
  );
  return (enhanced ?? fitting[0])?.identifier;
}

export const deviceVoice: VoiceEngine = {
  async speak(text: string, { voice, signal }: SpeakOptions) {
    const identifier = await bestVoice(voice);
    if (signal.aborted) return;
    const language = voice === "india" ? INDIAN_ENGLISH : undefined;
    return new Promise<void>((resolve) => {
      const stop = () => void Speech.stop();
      signal.addEventListener("abort", stop);
      const settle = () => {
        signal.removeEventListener("abort", stop);
        resolve();
      };
      Speech.speak(text, {
        ...(identifier ? { voice: identifier } : {}),
        ...(language ? { language } : {}),
        onDone: settle,
        onStopped: settle,
        onError: settle,
      });
    });
  },
  stop: () => void Speech.stop(),
};
