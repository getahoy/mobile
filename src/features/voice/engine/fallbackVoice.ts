import { logger } from "@/features/logging/logger";
import { deviceVoice } from "./deviceVoice";
import {
  type PreparedSpeech,
  playSpeech,
  prepareSpeech,
} from "./elevenLabsVoice";
import type { SpeakOptions, SpokenEnd, VoiceEngine } from "./voiceEngine";

// Past this the device voice speaks instead, so a slow network never leaves silence.
const FIRST_AUDIO_MS = 1500;

type Late = { kind: "late" };

function timeout(signal: AbortSignal): Promise<Late> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve({ kind: "late" }), FIRST_AUDIO_MS);
    signal.addEventListener("abort", () => clearTimeout(timer));
  });
}

// The ElevenLabs request is aborted before the device voice starts, so its audio can never play late.
async function speakWithFallback(
  text: string,
  { voice, signal }: SpeakOptions,
): Promise<SpokenEnd> {
  const fetching = new AbortController();
  const stopFetching = () => fetching.abort();
  signal.addEventListener("abort", stopFetching);
  const first: PreparedSpeech | Late = await Promise.race([
    prepareSpeech(text, voice, fetching.signal),
    timeout(fetching.signal),
  ]);
  if (signal.aborted) return { kind: "stopped" };
  if (first.kind === "ready") {
    signal.removeEventListener("abort", stopFetching);
    const played = await playSpeech(first.uri, signal);
    return played === "finished" ? { kind: "spoken" } : { kind: "stopped" };
  }
  fetching.abort();
  const reason = first.kind === "late" ? "timeout" : first.reason;
  logger.warn("voice", `Device voice instead of ElevenLabs: ${reason}`);
  return deviceVoice.speak(text, { voice, signal });
}

export function createFallbackVoice(): VoiceEngine {
  let current: AbortController | null = null;
  return {
    speak(text, options) {
      current?.abort();
      const own = new AbortController();
      current = own;
      options.signal.addEventListener("abort", () => own.abort());
      return speakWithFallback(text, { ...options, signal: own.signal });
    },
    stop() {
      current?.abort();
      current = null;
    },
  };
}
