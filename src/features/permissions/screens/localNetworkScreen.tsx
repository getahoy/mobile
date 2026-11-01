import { useLocalSearchParams } from "expo-router";
import { LocalNetworkExplainer } from "../components/localNetworkExplainer";
import { LocalNetworkGuide } from "../components/localNetworkGuide";

export function LocalNetworkScreen() {
  const { mac } = useLocalSearchParams<{ mac?: string }>();
  if (mac) return <LocalNetworkGuide macKey={mac} />;
  return <LocalNetworkExplainer />;
}
