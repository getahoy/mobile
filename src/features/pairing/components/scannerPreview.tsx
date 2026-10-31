import type { BarcodeSettings } from "expo-camera";
import { View } from "react-native";
import {
  GestureDetector,
  type PinchGesture,
} from "react-native-gesture-handler";
import { pairingCopy } from "../copy/pairingCopy";
import { ScannerCamera } from "./scannerCamera";

const qrCodesOnly: BarcodeSettings = { barcodeTypes: ["qr"] };

type ScannerPreviewProps = {
  torchOn: boolean;
  cameraZoom: number;
  pinch: PinchGesture;
  onScan: (code: string) => void;
};

export function ScannerPreview({
  torchOn,
  cameraZoom,
  pinch,
  onScan,
}: ScannerPreviewProps) {
  return (
    <GestureDetector gesture={pinch}>
      <View className="absolute inset-0">
        <ScannerCamera
          accessibilityLabel={pairingCopy["camera.label"]}
          className="flex-1"
          facing="back"
          enableTorch={torchOn}
          zoom={cameraZoom}
          barcodeScannerSettings={qrCodesOnly}
          onBarcodeScanned={(scan) => onScan(scan.data)}
        />
      </View>
    </GestureDetector>
  );
}
