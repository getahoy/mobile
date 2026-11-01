import { Text } from "@/components/ui/text";
import { permissionCopy } from "../copy/permissionCopy";
import type { DevicePermission } from "../permissionKind";
import { PermissionActions } from "./permissionActions";
import { PermissionLayout } from "./permissionLayout";
import { PermissionMessage } from "./permissionMessage";

type AskAgainScreenProps = {
  kind: DevicePermission;
  onAsk: () => void;
  onClose: () => void;
};

export function AskAgainScreen({ kind, onAsk, onClose }: AskAgainScreenProps) {
  const copy = permissionCopy.device(kind);
  return (
    <PermissionLayout onClose={onClose}>
      <PermissionMessage title={copy.againTitle} body={copy.againBody}>
        <Text variant="bodySmall" className="text-driftwood">
          {permissionCopy.againHintLead}
          <Text variant="bodySmall" className="font-sans-medium">
            {permissionCopy.againHintChoice}
          </Text>
          {permissionCopy.againHintEnd}
        </Text>
      </PermissionMessage>
      <PermissionActions
        label={copy.againAction}
        onPress={onAsk}
        onNotNow={onClose}
      />
    </PermissionLayout>
  );
}
