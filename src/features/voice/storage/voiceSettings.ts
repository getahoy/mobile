import {
  SPEAK_TARGETS,
  SPEAK_VOICES,
  type SpeakVoice,
} from "@getahoy/protocol";
import { createMMKV } from "react-native-mmkv";
import { z } from "zod";

export const SPEAK_POLICIES = ["problems", "everything", "off"] as const;

const SETTINGS_KEY = "voice.settings";
const INDIA_REGION = "IN";

const storage = createMMKV({ id: "ahoy.voice" });

const voiceSettingsSchema = z.object({
  playsOn: z.enum(SPEAK_TARGETS),
  policy: z.enum(SPEAK_POLICIES),
  voice: z.enum(SPEAK_VOICES),
  speakInSilentMode: z.boolean(),
});

export type VoiceSettings = z.infer<typeof voiceSettingsSchema>;
export type SpeakPolicy = (typeof SPEAK_POLICIES)[number];

function regionVoice(): SpeakVoice {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const region = /-([A-Z]{2})\b/.exec(locale)?.[1];
  return region === INDIA_REGION ? "india" : "default";
}

function defaults(): VoiceSettings {
  return {
    playsOn: "phone",
    policy: "problems",
    voice: regionVoice(),
    speakInSilentMode: false,
  };
}

function storedJson(): unknown {
  const text = storage.getString(SETTINGS_KEY);
  if (text === undefined) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// A bad stored value falls back to the defaults instead of crashing a screen.
export function readVoiceSettings(): VoiceSettings {
  const stored = z.record(z.string(), z.unknown()).safeParse(storedJson());
  const merged = { ...defaults(), ...(stored.success ? stored.data : {}) };
  const parsed = voiceSettingsSchema.safeParse(merged);
  return parsed.success ? parsed.data : defaults();
}

export function writeVoiceSettings(change: Partial<VoiceSettings>) {
  const next = { ...readVoiceSettings(), ...change };
  storage.set(SETTINGS_KEY, JSON.stringify(next));
  return next;
}
