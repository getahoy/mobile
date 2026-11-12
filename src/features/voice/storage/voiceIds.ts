import { parseStored } from "@getahoy/lib";
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
  const stored = voiceStorage.getString(VOICE_IDS_KEY);
  const ids = parseStored(speakVoicesSchema.shape.voices, stored) ?? UNKNOWN;
  return ids[voice];
}

export function writeVoiceIds(ids: VoiceIds): void {
  voiceStorage.set(VOICE_IDS_KEY, JSON.stringify(ids));
}
