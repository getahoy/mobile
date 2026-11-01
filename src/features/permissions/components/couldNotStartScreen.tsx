import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { permissionCopy } from "../copy/permissionCopy";
import type { PermissionKind } from "../permissionKind";
import { PermissionLayout } from "./permissionLayout";
import { PermissionMessage } from "./permissionMessage";

type CouldNotStartScreenProps = {
  kind: PermissionKind;
  onRetry: () => void;
  onClose: () => void;
};

export function CouldNotStartScreen({
  kind,
  onRetry,
  onClose,
}: CouldNotStartScreenProps) {
  const copy = permissionCopy.kind(kind);
  return (
    <PermissionLayout onClose={onClose}>
      <PermissionMessage title={copy.busyTitle} body={copy.busyBody} />
      <View className="gap-1.5 px-5 pb-safe">
        <Button
          className="active:scale-97 active:opacity-100"
          onPress={onRetry}
        >
          <Text>{permissionCopy.tryAgain}</Text>
        </Button>
        <Button variant="ghost" onPress={onClose}>
          <Text>{permissionCopy.notNow}</Text>
        </Button>
      </View>
    </PermissionLayout>
  );
}
