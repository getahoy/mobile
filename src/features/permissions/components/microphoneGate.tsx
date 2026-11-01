import { router } from "expo-router";
import { type GrantedVia, usePermissionGate } from "../hooks/usePermissionGate";
import { backHomeTurnedOn } from "../turnedOn";
import { PermissionGateView } from "./permissionGateView";

function landHome(via: GrantedVia): void {
  if (via === "settings") backHomeTurnedOn("mic");
  else router.back();
}

export function MicrophoneGate() {
  const gate = usePermissionGate("mic", {
    returnTo: "resumeTalk",
    resumed: false,
    onGranted: landHome,
  });
  return (
    <PermissionGateView kind="mic" gate={gate} onClose={() => router.back()} />
  );
}
