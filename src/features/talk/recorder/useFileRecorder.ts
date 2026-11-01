import {
  AudioQuality,
  IOSOutputFormat,
  type RecordingOptions,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { File } from "expo-file-system";
import { useCallback } from "react";
import { permissionAccess } from "@/features/permissions/platform/permissionAccess";
import { voiceLevel } from "./voiceLevel";

export type MicRefusal = "needed" | "failed";

type RecordingStart = "recording" | MicRefusal;

const STATE_INTERVAL_MS = 100;

const COMMAND_RECORDING: RecordingOptions = {
  isMeteringEnabled: true,
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

  // Read access fresh every time: Android "Only this time" access expires.
  const start = useCallback(async (): Promise<RecordingStart> => {
    const stage = await permissionAccess.mic.read().catch(() => null);
    if (stage !== "granted") return "needed";
    try {
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
      await recorder.prepareToRecordAsync();
      recorder.record();
      return "recording";
    } catch {
      return "failed";
    }
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
    start,
    stop,
    discard,
    isRecording: recorderState.isRecording,
    durationMs: recorderState.durationMillis,
    level: voiceLevel(recorderState.metering),
  };
}
