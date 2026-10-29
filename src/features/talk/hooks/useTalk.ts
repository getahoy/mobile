import type { SpeakTarget } from "@getahoy/protocol";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { authClient } from "@/features/auth/client/authClient";
import { useLiveMacLinks } from "@/features/pairing/hooks/useLiveMacLinks";
import type { PairedMac } from "@/features/pairing/storage/pairedMacs";
import { useVoiceReplies } from "@/features/voice/hooks/useVoiceReplies";
import { readVoiceSettings } from "@/features/voice/storage/voiceSettings";
import { useFileRecorder } from "../recorder/useFileRecorder";
import { signalPress } from "../sending/askMac";
import { TalkFlow } from "../sending/talkFlow";
import type { TalkState } from "../talkState";

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

  const { access, durationMs, level } = recorder;
  return { state, access, durationMs, level, flow };
}
