import {
  AudioQuality,
  getRecordingPermissionsAsync,
  IOSOutputFormat,
  type RecordingOptions,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { File } from "expo-file-system";
import { useCallback, useEffect, useState } from "react";

const STATE_INTERVAL_MS = 200;

const COMMAND_RECORDING: RecordingOptions = {
  extension: ".m4a",
  sampleRate: 16_000,
  numberOfChannels: 1,
  bitRate: 32_000,
  ios: {
    outputFormat: IOSOutputFormat.MPEG4AAC,
    audioQuality: AudioQuality.MEDIUM,
  },
  android: { outputFormat: "mpeg4", audioEncoder: "aac" },
  web: {},
};

export type MicAccess = "unknown" | "granted" | "askable" | "blocked";

function accessOf(granted: boolean, canAskAgain: boolean): MicAccess {
  if (granted) return "granted";
  return canAskAgain ? "askable" : "blocked";
}

export function deleteRecording(uri: string): void {
  try {
    new File(uri).delete();
  } catch {
    return;
  }
}

export type FileRecorder = ReturnType<typeof useFileRecorder>;

export function useFileRecorder() {
  const recorder = useAudioRecorder(COMMAND_RECORDING);
  const recorderState = useAudioRecorderState(recorder, STATE_INTERVAL_MS);
  const [access, setAccess] = useState<MicAccess>("unknown");

  useEffect(() => {
    void getRecordingPermissionsAsync().then(({ granted, canAskAgain }) =>
      setAccess(accessOf(granted, canAskAgain)),
    );
  }, []);

  const requestAccess = useCallback(async (): Promise<boolean> => {
    const { granted, canAskAgain } = await requestRecordingPermissionsAsync();
    setAccess(accessOf(granted, canAskAgain));
    return granted;
  }, []);

  const start = useCallback(async (): Promise<void> => {
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  }, [recorder]);

  const stop = useCallback(async (): Promise<string | null> => {
    await recorder.stop();
    await setAudioModeAsync({ allowsRecording: false });
    return recorder.uri;
  }, [recorder]);

  const discard = useCallback(async (): Promise<void> => {
    const uri = await stop().catch(() => recorder.uri);
    if (uri) deleteRecording(uri);
  }, [recorder, stop]);

  return {
    access,
    requestAccess,
    start,
    stop,
    discard,
    isRecording: recorderState.isRecording,
    durationMs: recorderState.durationMillis,
  };
}
