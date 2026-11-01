import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { permissionCopy } from "../copy/permissionCopy";
import type { DevicePermission } from "../permissionKind";
import { PermissionLayout } from "./permissionLayout";
import { PermissionMessage } from "./permissionMessage";

type AskAgainScreenProps = {
  kind: DevicePermission;
  onAsk: () => void;
  onClose: () => void;
};

export function AskAgainScreen({ kind, onAsk, onClose }: AskAgainScreenProps) {
  const copy = permissionCopy.kind(kind);
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
      <View className="gap-1.5 px-5 pb-safe">
        <Button className="active:scale-97 active:opacity-100" onPress={onAsk}>
          <Text>{copy.againAction}</Text>
        </Button>
        <Button variant="ghost" onPress={onClose}>
          <Text>{permissionCopy.notNow}</Text>
        </Button>
      </View>
    </PermissionLayout>
  );
}
