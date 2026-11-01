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
import { voiceLevel } from "./voiceLevel";

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
    start,
    stop,
    discard,
    isRecording: recorderState.isRecording,
    durationMs: recorderState.durationMillis,
    level: voiceLevel(recorderState.metering),
  };
}
