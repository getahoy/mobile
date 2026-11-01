import type { SpeakTarget } from "@getahoy/protocol";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { authClient } from "@/features/auth/client/authClient";
import { useLiveMacLinks } from "@/features/pairing/hooks/useLiveMacLinks";
import type { PairedMac } from "@/features/pairing/storage/pairedMacs";
import { permissionAccess } from "@/features/permissions/platform/permissionAccess";
import { useVoiceReplies } from "@/features/voice/hooks/useVoiceReplies";
import { readVoiceSettings } from "@/features/voice/storage/voiceSettings";
import { useFileRecorder } from "../recorder/useFileRecorder";
import { signalPress } from "../sending/askMac";
import { type MicRefusal, TalkFlow } from "../sending/talkFlow";
import type { TalkState } from "../talkState";

// Read fresh before every recording: Android "Only this time" access expires.
function micAllowed(): Promise<boolean> {
  return permissionAccess.mic.read().then((stage) => stage === "granted");
}

function openMicrophoneGate(refusal: MicRefusal): void {
  const params = refusal === "failed" ? { failed: "1" } : {};
  router.push({ pathname: "/microphone", params });
}

// One rejected upload is not proof the session is gone, so ask the server first.
async function signOutIfSessionGone(): Promise<void> {
  const { data, error } = await authClient.getSession();
  if (!data && !error) await authClient.signOut();
}

export function useTalk(mac: PairedMac | null) {
  const live = useLiveMacLinks();
  const recorder = useFileRecorder();
  const [state, setState] = useState<TalkState>({ kind: "ready" });
  const voice = useVoiceReplies(state, recorder.isRecording);
  const macKey = mac?.publicKey ?? null;
  const latest = useRef({ recorder, macKey, stopVoice: voice.stop });
  const [flow] = useState(() => {
    const session = () => {
      const { macKey: key } = latest.current;
      return key ? live.session(key) : null;
    };
    const speakOn = (): SpeakTarget => {
      const { playsOn, policy } = readVoiceSettings();
      return policy === "off" ? "off" : playsOn;
    };
    return new TalkFlow({
      recorder: () => latest.current.recorder,
      micAllowed,
      onMicRefused: openMicrophoneGate,
      session,
      speakOn,
      onPress: (choosingFor) => {
        latest.current.stopVoice();
        signalPress(session(), choosingFor);
      },
      onState: setState,
    });
  });

  useEffect(() => {
    latest.current = { recorder, macKey, stopVoice: voice.stop };
  });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (appState) => {
      if (appState !== "active") flow.interrupt();
    });
    return () => subscription.remove();
  }, [flow]);

  useEffect(() => {
    flow.recordingChanged(recorder.isRecording);
  }, [flow, recorder.isRecording]);

  const signedOut = state.kind === "failed" && state.failure === "signedOut";
  useEffect(() => {
    if (signedOut) void signOutIfSessionGone().catch(() => undefined);
  }, [signedOut]);

  const { durationMs, level } = recorder;
  return { state, durationMs, level, flow, speech: voice.speech };
}
