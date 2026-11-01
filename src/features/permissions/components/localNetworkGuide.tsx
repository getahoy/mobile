import { router } from "expo-router";
import { Linking } from "react-native";
import { useLocalNetworkGuide } from "../hooks/useLocalNetworkGuide";
import { SettingsGuideScreen } from "./settingsGuideScreen";

type LocalNetworkGuideProps = { macKey: string };

export function LocalNetworkGuide({ macKey }: LocalNetworkGuideProps) {
  useLocalNetworkGuide(macKey);
  return (
    <SettingsGuideScreen
      target={{ look: "ios", kind: "net" }}
      onOpenSettings={() => void Linking.openSettings()}
      onClose={() => router.back()}
    />
  );
}
