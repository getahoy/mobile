import type { SpeakVoice } from "@getahoy/protocol";

export type BundledSample = {
  voice: SpeakVoice;
  voiceId: string;
  text: string;
};

export type PreviewSource =
  | { kind: "cache"; uri: string }
  | { kind: "bundled" }
  | { kind: "fetch" }
  | { kind: "device" };

type PreviewFacts = {
  cachedUri: string | null;
  bundled: BundledSample | null;
  voiceId: string | null;
  text: string;
  online: boolean;
};

function bundledMatches(
  bundled: BundledSample | null,
  voiceId: string | null,
  text: string,
): boolean {
  if (!bundled || bundled.text !== text) return false;
  return voiceId === null || bundled.voiceId === voiceId;
}

export function previewSource(facts: PreviewFacts): PreviewSource {
  if (facts.cachedUri) return { kind: "cache", uri: facts.cachedUri };
  if (bundledMatches(facts.bundled, facts.voiceId, facts.text)) {
    return { kind: "bundled" };
  }
  return facts.online ? { kind: "fetch" } : { kind: "device" };
}
