import type { SpeakVoice } from "@getahoy/protocol";

export type SpeakOptions = {
  voice: SpeakVoice;
  signal: AbortSignal;
};

export type SpokenEnd =
  | { kind: "spoken" }
  | { kind: "stopped" }
  | { kind: "failed"; reason: "timeout" | "http" | "offline" | "device" };

export type VoiceEngine = {
  speak: (text: string, options: SpeakOptions) => Promise<SpokenEnd>;
  stop: () => void;
};
