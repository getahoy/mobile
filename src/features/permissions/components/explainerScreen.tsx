import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { permissionCopy } from "../copy/permissionCopy";
import type { PermissionKind } from "../permissionKind";
import { PermissionLayout } from "./permissionLayout";
import { PermissionMessage } from "./permissionMessage";

type ExplainerScreenProps = {
  kind: PermissionKind;
  onContinue: () => void;
  onClose: () => void;
};

export function ExplainerScreen({
  kind,
  onContinue,
  onClose,
}: ExplainerScreenProps) {
  const copy = permissionCopy.kind(kind);
  return (
    <PermissionLayout onClose={onClose}>
      <PermissionMessage
        title={copy.explainerTitle}
        body={copy.explainerBody}
      />
      <View className="px-5 pb-safe-offset-2">
        <Button
          className="active:scale-97 active:opacity-100"
          onPress={onContinue}
        >
          <Text>{copy.explainerAction}</Text>
        </Button>
      </View>
    </PermissionLayout>
  );
}
