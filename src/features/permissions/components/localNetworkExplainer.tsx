import { router } from "expo-router";
import { useLocalNetworkIntroSeen } from "../storage/localNetworkMemory";
import { ExplainerScreen } from "./explainerScreen";

export function LocalNetworkExplainer() {
  const { markSeen } = useLocalNetworkIntroSeen();
  const done = () => {
    markSeen();
    router.back();
  };
  return <ExplainerScreen kind="net" onContinue={done} onClose={done} />;
}
