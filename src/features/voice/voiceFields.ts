import type { VoiceOption } from "./components/voiceOptionSheet";
import { voiceCopy } from "./copy/voiceCopy";
import type { VoiceSettings } from "./storage/voiceSettings";

export type VoiceField = "playsOn" | "policy" | "voice";

function optionsOf<Key extends string>(
  labels: Readonly<Record<Key, string>>,
  help: Readonly<Record<Key, string>>,
): VoiceOption<Key>[] {
  return Object.keys(labels)
    .filter((key): key is Key => key in labels)
    .map((key) => ({ key, label: labels[key], help: help[key] }));
}

export const voiceFields = {
  playsOn: {
    title: voiceCopy.playsOn,
    options: optionsOf(voiceCopy.playsOnOptions, voiceCopy.playsOnHelp),
  },
  policy: {
    title: voiceCopy.policy,
    options: optionsOf(voiceCopy.policyOptions, voiceCopy.policyHelp),
  },
  voice: {
    title: voiceCopy.voice,
    options: optionsOf(voiceCopy.voiceOptions, voiceCopy.voiceHelp),
  },
} as const;

export function voiceValueLabel(
  field: VoiceField,
  settings: VoiceSettings,
): string {
  const { options } = voiceFields[field];
  return options.find((option) => option.key === settings[field])?.label ?? "";
}
