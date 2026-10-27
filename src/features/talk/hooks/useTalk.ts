import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { authClient } from "@/features/auth/client/authClient";
import { useLiveMacLinks } from "@/features/pairing/hooks/useLiveMacLinks";
import type { PairedMac } from "@/features/pairing/storage/pairedMacs";
import { useFileRecorder } from "../recorder/useFileRecorder";
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
  const latest = useRef({ recorder, macKey: mac?.publicKey ?? null });
  const [flow] = useState(
    () =>
      new TalkFlow({
        recorder: () => latest.current.recorder,
        session: () => {
          const { macKey } = latest.current;
          return macKey ? live.session(macKey) : null;
        },
        onState: setState,
      }),
  );

  useEffect(() => {
    latest.current = { recorder, macKey: mac?.publicKey ?? null };
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
