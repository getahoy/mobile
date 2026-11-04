import type { SpeakVoice } from "@getahoy/protocol";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { voiceCopy } from "../copy/voiceCopy";
import { VoicePreview } from "../engine/voicePreview";
import { IDLE, type PreviewState } from "../previewState";

export function useVoicePreview(open: boolean) {
  const [state, setState] = useState<PreviewState>(IDLE);
  const [preview] = useState(
    () => new VoicePreview(voiceCopy.previewLine, setState),
  );

  useEffect(() => {
    if (open) preview.warm();
    else preview.stop();
  }, [open, preview]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (appState) => {
      if (appState !== "active") preview.stop();
    });
    return () => {
      subscription.remove();
      preview.stop();
    };
  }, [preview]);

  return { state, toggle: (voice: SpeakVoice) => preview.toggle(voice) };
}
