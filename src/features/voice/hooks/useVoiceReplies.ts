import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, AppState } from "react-native";
import type { TalkState } from "@/features/talk/talkState";
import { playSource, preparePlayback } from "../engine/audioPlayback";
import { createFallbackVoice } from "../engine/fallbackVoice";
import type { VoiceEngine } from "../engine/voiceEngine";
import { replyAction } from "../replyAction";
import { readVoiceSettings } from "../storage/voiceSettings";

const DONE_SOUND = require("../../../../assets/sounds/done.m4a");

type Answered = Extract<TalkState, { kind: "answered" }>;

export type Speech = { speaking: boolean; level: number | null };

const SILENT: Speech = { speaking: false, level: null };

function useScreenReader(): boolean {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    void AccessibilityInfo.isScreenReaderEnabled().then(setEnabled);
    const subscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      setEnabled,
    );
    return () => subscription.remove();
  }, []);
  return enabled;
}

async function chime(signal: AbortSignal): Promise<void> {
  void impactAsync(ImpactFeedbackStyle.Light).catch(() => undefined);
  await playSource(DONE_SOUND, signal);
}

export function useVoiceReplies(state: TalkState, recording: boolean) {
  const [voice] = useState(createFallbackVoice);
  const [speech, setSpeech] = useState<Speech>(SILENT);
  const screenReader = useScreenReader();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (appState) => {
      if (appState !== "active") voice.stop();
    });
    return () => subscription.remove();
  }, [voice]);

  useEffect(() => {
    if (state.kind !== "answered") return;
    if (handled.current === state.commandId) return;
    handled.current = state.commandId;
    const context = { recording, screenReader, speak: voice.speak };
    void reply(state, context, setSpeech).finally(() => setSpeech(SILENT));
  }, [state, recording, screenReader, voice]);

  return { stop: voice.stop, speech };
}

type Context = {
  recording: boolean;
  screenReader: boolean;
  speak: VoiceEngine["speak"];
};

async function reply(
  answered: Answered,
  { recording, screenReader, speak }: Context,
  report: (speech: Speech) => void,
): Promise<void> {
  const settings = readVoiceSettings();
  const line = answered.speech ?? answered.message;
  const action = replyAction({
    status: answered.status,
    asks: answered.choices.length > 0,
    playsOn: settings.playsOn,
    policy: settings.policy,
    ageMs: Date.now() - answered.sentAt,
    recording,
    screenReader,
  });
  if (action === "quiet") return;
  if (action === "announce") {
    AccessibilityInfo.announceForAccessibility(line);
    return;
  }
  await preparePlayback(settings.speakInSilentMode).catch(() => undefined);
  const signal = new AbortController().signal;
  if (action === "chime") return chime(signal);
  report({ speaking: true, level: null });
  const onLevel = (level: number) => report({ speaking: true, level });
  await speak(line, { voice: settings.voice, signal, onLevel });
}
