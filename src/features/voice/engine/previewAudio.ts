import type { SpeakVoice } from "@getahoy/protocol";
import type { AudioSource } from "expo-audio";
import { getNetworkStateAsync } from "expo-network";
import { type PreviewSource, previewSource } from "../previewSource";
import { readVoiceId } from "../storage/voiceIds";
import { bundledAudio, bundledSample } from "./bundledSamples";
import { type PreparedSpeech, prepareSpeech } from "./elevenLabsVoice";
import { cachedSpeech, speechKey } from "./speechCache";

export type Playable =
  | { kind: "audio"; source: AudioSource }
  | { kind: "device" };

const DEVICE: Playable = { kind: "device" };

export class SpeechFetches {
  readonly #pending = new Map<string, Promise<PreparedSpeech>>();
  readonly #warmed = new Set<string>();

  fetch(key: string, text: string, voice: SpeakVoice) {
    const pending = this.#pending.get(key);
    if (pending) return pending;
    const unstoppable = new AbortController().signal;
    const started = prepareSpeech(text, voice, unstoppable).finally(() =>
      this.#pending.delete(key),
    );
    this.#pending.set(key, started);
    return started;
  }

  warm(key: string, text: string, voice: SpeakVoice): void {
    if (this.#warmed.has(key)) return;
    this.#warmed.add(key);
    void this.fetch(key, text, voice).catch(() => undefined);
  }
}

async function isOnline(): Promise<boolean> {
  const network = await getNetworkStateAsync().catch(() => null);
  return (
    network?.isConnected !== false && network?.isInternetReachable !== false
  );
}

export async function locatePreview(
  text: string,
  voice: SpeakVoice,
): Promise<{ key: string; source: PreviewSource }> {
  const key = await speechKey(text, voice);
  const source = previewSource({
    cachedUri: cachedSpeech(key),
    bundled: bundledSample(voice, text),
    voiceId: readVoiceId(voice),
    text,
    online: await isOnline(),
  });
  return { key, source };
}

export async function choosePlayable(
  text: string,
  voice: SpeakVoice,
  fetches: SpeechFetches,
): Promise<Playable> {
  const { key, source } = await locatePreview(text, voice);
  switch (source.kind) {
    case "cache":
      return { kind: "audio", source: { uri: source.uri } };
    case "bundled": {
      const audio = bundledAudio(voice, text);
      return audio ? { kind: "audio", source: audio } : DEVICE;
    }
    case "fetch": {
      const prepared = await fetches.fetch(key, text, voice);
      return prepared.kind === "ready"
        ? { kind: "audio", source: { uri: prepared.uri } }
        : DEVICE;
    }
    case "device":
      return DEVICE;
    default: {
      const unhandled: never = source;
      return unhandled;
    }
  }
}
