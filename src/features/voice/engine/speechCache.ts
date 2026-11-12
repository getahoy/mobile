import { parseStored } from "@getahoy/lib";
import { type SpeakVoice, speechPaceKey } from "@getahoy/protocol";
import { CryptoDigestAlgorithm, digestStringAsync } from "expo-crypto";
import { Directory, File, Paths } from "expo-file-system";
import { z } from "zod";
import { readVoiceId } from "../storage/voiceIds";
import { voiceStorage } from "../storage/voiceSettings";
import { touchCache } from "./cacheOrder";

const ORDER_KEY = "voice.cacheOrder";
const AUDIO_EXTENSION = ".mp3";
const UNKNOWN_VOICE_ID = "unknown";

const orderSchema = z.array(z.string());

function speechDirectory(): Directory {
  const directory = new Directory(Paths.cache, "speech");
  if (!directory.exists) directory.create({ intermediates: true });
  return directory;
}

function readOrder(): string[] {
  return parseStored(orderSchema, voiceStorage.getString(ORDER_KEY)) ?? [];
}

function fileFor(key: string): File {
  return new File(speechDirectory(), `${key}${AUDIO_EXTENSION}`);
}

function remember(key: string): void {
  const { order, evicted } = touchCache(readOrder(), key);
  for (const old of evicted) {
    const file = fileFor(old);
    if (file.exists) file.delete();
  }
  voiceStorage.set(ORDER_KEY, JSON.stringify(order));
}

// The server voice id and pace are part of the key, so changing either on the server never
// replays old audio.
export function speechKey(text: string, voice: SpeakVoice): Promise<string> {
  const voiceId = readVoiceId(voice) ?? UNKNOWN_VOICE_ID;
  const material = `${voice}\n${voiceId}\n${speechPaceKey()}\n${text}`;
  return digestStringAsync(CryptoDigestAlgorithm.SHA256, material);
}

export function cachedSpeech(key: string): string | null {
  const file = fileFor(key);
  if (!file.exists) return null;
  remember(key);
  return file.uri;
}

export async function storeSpeech(
  key: string,
  bytes: ArrayBuffer,
): Promise<string> {
  const file = fileFor(key);
  await file.write(bytes);
  remember(key);
  return file.uri;
}
