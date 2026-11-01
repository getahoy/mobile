import { permissionCopy } from "../copy/permissionCopy";
import type { PermissionKind } from "../permissionKind";
import { PermissionLayout } from "./permissionLayout";
import { PermissionMessage } from "./permissionMessage";

type RestrictedScreenProps = { kind: PermissionKind; onClose: () => void };

export function RestrictedScreen({ kind, onClose }: RestrictedScreenProps) {
  const copy = permissionCopy.kind(kind);
  return (
    <PermissionLayout onClose={onClose}>
      <PermissionMessage
        title={copy.restrictedTitle}
        body={copy.restrictedBody}
      />
    </PermissionLayout>
  );
}
