import { router } from "expo-router";
import { Linking } from "react-native";
import { useLocalNetworkGuide } from "../hooks/useLocalNetworkGuide";
import { permissionPlatform } from "../platform/permissionPlatform";
import { SettingsGuideScreen } from "./settingsGuideScreen";

type LocalNetworkGuideProps = { macKey: string };

export function LocalNetworkGuide({ macKey }: LocalNetworkGuideProps) {
  useLocalNetworkGuide(macKey);
  return (
    <SettingsGuideScreen
      kind="net"
      look={permissionPlatform.settingsLook}
      onOpenSettings={() => void Linking.openSettings()}
      onClose={() => router.back()}
    />
  );
}
