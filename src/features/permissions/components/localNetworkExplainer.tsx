import { router, useIsFocused } from "expo-router";
import { useBackToClose } from "@/lib/useBackToClose";
import { useLocalNetworkIntroSeen } from "../storage/localNetworkMemory";
import { ExplainerScreen } from "./explainerScreen";

export function LocalNetworkExplainer() {
  const { markSeen } = useLocalNetworkIntroSeen();
  const done = () => {
    markSeen();
    router.back();
  };
  useBackToClose(useIsFocused(), done);
  return <ExplainerScreen kind="net" onContinue={done} onClose={done} />;
}
