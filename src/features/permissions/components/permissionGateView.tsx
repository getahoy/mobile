import { View } from "react-native";
import { permissionCopy } from "../copy/permissionCopy";
import type { PermissionGate } from "../hooks/usePermissionGate";
import type { DevicePermission } from "../permissionKind";
import { permissionPlatform } from "../platform/permissionPlatform";
import { AskAgainScreen } from "./askAgainScreen";
import { CouldNotStartScreen } from "./couldNotStartScreen";
import { ExplainerScreen } from "./explainerScreen";
import { RestrictedScreen } from "./restrictedScreen";
import { SettingsGuideScreen } from "./settingsGuideScreen";

type PermissionGateViewProps = {
  kind: DevicePermission;
  gate: PermissionGate;
  onClose: () => void;
};

export function PermissionGateView({
  kind,
  gate,
  onClose,
}: PermissionGateViewProps) {
  switch (gate.screen) {
    case "checking":
    case "granted":
      return (
        <View
          accessibilityLabel={permissionCopy.checking}
          className="flex-1 bg-sailcloth"
        />
      );
    case "explainer":
      return (
        <ExplainerScreen kind={kind} onContinue={gate.ask} onClose={onClose} />
      );
    case "again":
      return <AskAgainScreen kind={kind} onAsk={gate.ask} onClose={onClose} />;
    case "guide":
      return (
        <SettingsGuideScreen
          kind={kind}
          look={permissionPlatform.settingsLook}
          onOpenSettings={gate.openSettings}
          onClose={onClose}
        />
      );
    case "restricted":
      return <RestrictedScreen kind={kind} onClose={onClose} />;
    case "busy":
      return (
        <CouldNotStartScreen
          kind={kind}
          onRetry={gate.retry}
          onClose={onClose}
        />
      );
    default: {
      const unhandled: never = gate.screen;
      return unhandled;
    }
  }
}
