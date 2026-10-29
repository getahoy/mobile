import type { SpeakVoice } from "@getahoy/protocol";

export type SpeakOptions = {
  voice: SpeakVoice;
  signal: AbortSignal;
};

export type VoiceEngine = {
  speak: (text: string, options: SpeakOptions) => Promise<void>;
  stop: () => void;
};
