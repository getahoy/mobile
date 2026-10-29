import type { SpeakVoice } from "@getahoy/protocol";
import * as Speech from "expo-speech";
import type { SpeakOptions, SpokenEnd, VoiceEngine } from "./voiceEngine";

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
    if (signal.aborted) return { kind: "stopped" };
    const language = voice === "india" ? INDIAN_ENGLISH : undefined;
    return new Promise<SpokenEnd>((resolve) => {
      const stop = () => void Speech.stop();
      signal.addEventListener("abort", stop);
      const settle = (end: SpokenEnd) => {
        signal.removeEventListener("abort", stop);
        resolve(end);
      };
      Speech.speak(text, {
        ...(identifier ? { voice: identifier } : {}),
        ...(language ? { language } : {}),
        onDone: () => settle({ kind: "spoken" }),
        onStopped: () => settle({ kind: "stopped" }),
        onError: () => settle({ kind: "failed", reason: "device" }),
      });
    });
  },
  stop: () => void Speech.stop(),
};
