import type { SpeakVoice } from "@getahoy/protocol";
import { fetchSpeech } from "../client/speakApi";
import { playSource } from "./audioPlayback";
import { cachedSpeech, speechKey, storeSpeech } from "./speechCache";

export type PreparedSpeech =
  | { kind: "ready"; uri: string }
  | { kind: "failed"; reason: "http" | "offline" | "stopped" };

export async function prepareSpeech(
  text: string,
  voice: SpeakVoice,
  signal: AbortSignal,
): Promise<PreparedSpeech> {
  const key = await speechKey(text, voice);
  const cached = cachedSpeech(key);
  if (cached) return { kind: "ready", uri: cached };
  const audio = await fetchSpeech(text, voice, signal);
  if (audio.kind === "failed") return audio;
  if (signal.aborted) return { kind: "failed", reason: "stopped" };
  return { kind: "ready", uri: await storeSpeech(key, audio.bytes) };
}

export function playSpeech(uri: string, signal: AbortSignal) {
  return playSource({ uri }, signal);
}
