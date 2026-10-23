import { CameraView, useCameraPermissions } from "expo-camera";
import { ActivityIndicator, Linking, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { pairingCopy } from "../copy/pairingCopy";

type QrScannerProps = {
  active: boolean;
  onScanned: (scanned: string) => void;
};

export function QrScanner({ active, onScanned }: QrScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return (
      <ActivityIndicator
        accessibilityLabel={pairingCopy["camera.loading"]}
        colorClassName="accent-muted-foreground"
      />
    );
  }
  if (!permission.granted) {
    const blocked = !permission.canAskAgain;
    return (
      <View className="gap-3">
        <Text className="text-muted-foreground">
          {pairingCopy[blocked ? "camera.blocked" : "camera.needed"]}
        </Text>
        <Button
          onPress={() =>
            void (blocked ? Linking.openSettings() : requestPermission())
          }
        >
          <Text>
            {pairingCopy[blocked ? "camera.openSettings" : "camera.allow"]}
          </Text>
        </Button>
      </View>
    );
  }
  return (
    <View className="aspect-square overflow-hidden rounded-xl">
      <CameraView
        accessibilityLabel={pairingCopy["camera.label"]}
        className="flex-1"
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={active ? (scan) => onScanned(scan.data) : undefined}
      />
    </View>
  );
}
