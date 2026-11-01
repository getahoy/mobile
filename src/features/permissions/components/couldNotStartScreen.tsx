import { permissionCopy } from "../copy/permissionCopy";
import type { DevicePermission } from "../permissionKind";
import { PermissionActions } from "./permissionActions";
import { PermissionLayout } from "./permissionLayout";
import { PermissionMessage } from "./permissionMessage";

type CouldNotStartScreenProps = {
  kind: DevicePermission;
  onRetry: () => void;
  onClose: () => void;
};

export function CouldNotStartScreen({
  kind,
  onRetry,
  onClose,
}: CouldNotStartScreenProps) {
  const copy = permissionCopy.device(kind);
  return (
    <PermissionLayout onClose={onClose}>
      <PermissionMessage title={copy.busyTitle} body={copy.busyBody} />
      <PermissionActions
        label={permissionCopy.tryAgain}
        onPress={onRetry}
        onNotNow={onClose}
      />
    </PermissionLayout>
  );
}
