import { router, useLocalSearchParams } from "expo-router";
import { CouldNotStartScreen } from "../components/couldNotStartScreen";
import { MicrophoneGate } from "../components/microphoneGate";

const close = () => router.back();

export function MicrophoneScreen() {
  const { failed } = useLocalSearchParams<{ failed?: string }>();
  if (failed !== "1") return <MicrophoneGate />;
  return <CouldNotStartScreen kind="mic" onRetry={close} onClose={close} />;
}
