import {
  type SpeakVoice,
  type SpeakVoices,
  speakVoicesSchema,
} from "@getahoy/protocol";
import { voiceStorage } from "./voiceSettings";

const VOICE_IDS_KEY = "voice.ids";

type VoiceIds = SpeakVoices["voices"];

const UNKNOWN: VoiceIds = { default: null, india: null };

export function readVoiceId(voice: SpeakVoice): string | null {
  try {
    const stored = voiceStorage.getString(VOICE_IDS_KEY) ?? "null";
    const parsed = speakVoicesSchema.shape.voices.safeParse(JSON.parse(stored));
    return (parsed.success ? parsed.data : UNKNOWN)[voice];
  } catch {
    return UNKNOWN[voice];
  }
}

export function writeVoiceIds(ids: VoiceIds): void {
  voiceStorage.set(VOICE_IDS_KEY, JSON.stringify(ids));
}
