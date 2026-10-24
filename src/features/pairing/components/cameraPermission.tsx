import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { pairingCopy } from "../copy/pairingCopy";

type CameraPermissionProps = {
  blocked: boolean;
  onAllow: () => void;
  onOpenSettings: () => void;
  onClose: () => void;
};

export function CameraPermission({
  blocked,
  onAllow,
  onOpenSettings,
  onClose,
}: CameraPermissionProps) {
  return (
    <View className="flex-1 justify-center gap-6 bg-background p-6">
      <View className="gap-2">
        <Text variant="h3">{pairingCopy["scanner.title"]}</Text>
        <Text className="text-muted-foreground">
          {pairingCopy[blocked ? "camera.blocked" : "camera.needed"]}
        </Text>
      </View>
      <Button onPress={blocked ? onOpenSettings : onAllow}>
        <Text>
          {pairingCopy[blocked ? "camera.openSettings" : "camera.allow"]}
        </Text>
      </Button>
      <Button variant="ghost" onPress={onClose}>
        <Text>{pairingCopy["scanner.close"]}</Text>
      </Button>
    </View>
  );
}
