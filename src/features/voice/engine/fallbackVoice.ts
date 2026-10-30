import { logger } from "@/features/logging/logger";
import { playSource } from "./audioPlayback";
import { deviceVoice } from "./deviceVoice";
import { type PreparedSpeech, prepareSpeech } from "./elevenLabsVoice";
import type { SpeakOptions, VoiceEngine } from "./voiceEngine";

// Past this the device voice speaks instead, so a slow network never leaves silence.
const FIRST_AUDIO_MS = 2500;

type Late = { kind: "late" };

function firstAudio(
  preparing: Promise<PreparedSpeech>,
): Promise<PreparedSpeech | Late> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const late = new Promise<Late>((resolve) => {
    timer = setTimeout(() => resolve({ kind: "late" }), FIRST_AUDIO_MS);
  });
  return Promise.race([preparing, late]).finally(() => clearTimeout(timer));
}

function prepareAndCache(text: string, voice: SpeakOptions["voice"]) {
  const requestedAt = Date.now();
  const unstoppable = new AbortController().signal;
  return prepareSpeech(text, voice, unstoppable).then((prepared) => {
    const waitedMs = Date.now() - requestedAt;
    if (__DEV__)
      logger.info("voice", `Speech ${prepared.kind} in ${waitedMs} ms`);
    return prepared;
  });
}

// A late download keeps going so the cache has the phrase next time, but only
// audio that is ready before the deadline is ever played.
async function speakWithFallback(
  text: string,
  { voice, signal, onLevel }: SpeakOptions,
): Promise<void> {
  const first = await firstAudio(prepareAndCache(text, voice));
  if (signal.aborted) return;
  if (first.kind === "ready") {
    return playSource({ uri: first.uri }, signal, onLevel);
  }
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
      options.signal.addEventListener("abort", () => own.abort(), {
        once: true,
      });
      return speakWithFallback(text, { ...options, signal: own.signal });
    },
    stop() {
      current?.abort();
      current = null;
    },
  };
}
