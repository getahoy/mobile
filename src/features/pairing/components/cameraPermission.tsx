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
    <View className="flex-1 bg-sailcloth px-5 pt-safe-offset-14 pb-safe-offset-2">
      <View className="flex-1 gap-3 px-1">
        <Text variant="heading">{pairingCopy["scanner.title"]}</Text>
        <Text className="text-driftwood">
          {pairingCopy[blocked ? "camera.blocked" : "camera.needed"]}
        </Text>
      </View>
      <View className="gap-1.5">
        <Button onPress={blocked ? onOpenSettings : onAllow}>
          <Text>
            {pairingCopy[blocked ? "camera.openSettings" : "camera.allow"]}
          </Text>
        </Button>
        <Button variant="ghost" onPress={onClose}>
          <Text>{pairingCopy["scanner.close"]}</Text>
        </Button>
      </View>
    </View>
  );
}
