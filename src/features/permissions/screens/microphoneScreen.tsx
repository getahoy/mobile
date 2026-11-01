import { router, useLocalSearchParams } from "expo-router";
import { CouldNotStartScreen } from "../components/couldNotStartScreen";
import { PermissionGateView } from "../components/permissionGateView";
import { type GrantedVia, usePermissionGate } from "../hooks/usePermissionGate";
import { backHomeTurnedOn } from "../turnedOn";

const close = () => router.back();

function landHome(via: GrantedVia): void {
  if (via === "settings") backHomeTurnedOn("mic");
  else router.back();
}

export function MicrophoneScreen() {
  const { failed } = useLocalSearchParams<{ failed?: string }>();
  const gate = usePermissionGate("mic", {
    returnTo: "resumeTalk",
    resumed: false,
    onGranted: failed === "1" ? () => undefined : landHome,
  });
  if (failed === "1") {
    return <CouldNotStartScreen kind="mic" onRetry={close} onClose={close} />;
  }
  return <PermissionGateView kind="mic" gate={gate} onClose={close} />;
}
