import { permissionCopy } from "../copy/permissionCopy";
import type { DevicePermission } from "../permissionKind";
import { PermissionLayout } from "./permissionLayout";
import { PermissionMessage } from "./permissionMessage";

type RestrictedScreenProps = { kind: DevicePermission; onClose: () => void };

export function RestrictedScreen({ kind, onClose }: RestrictedScreenProps) {
  const copy = permissionCopy.device(kind);
  return (
    <PermissionLayout onClose={onClose}>
      <PermissionMessage
        title={copy.restrictedTitle}
        body={copy.restrictedBody}
      />
    </PermissionLayout>
  );
}
