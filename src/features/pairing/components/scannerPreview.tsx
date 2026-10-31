import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { pairingCopy } from "../copy/pairingCopy";
import type { ScannerZoomState } from "../hooks/useScannerZoom";
import { ScannerCamera } from "./scannerCamera";

type ScannerPreviewProps = {
  torchOn: boolean;
  zoom: ScannerZoomState;
  onScan: (code: string) => void;
};

export function ScannerPreview({ torchOn, zoom, onScan }: ScannerPreviewProps) {
  return (
    <GestureDetector gesture={zoom.pinch}>
      <View className="absolute inset-0">
        <ScannerCamera
          accessibilityLabel={pairingCopy["camera.label"]}
          className="flex-1"
          facing="back"
          enableTorch={torchOn}
          zoom={zoom.cameraZoom}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={(scan) => onScan(scan.data)}
        />
      </View>
    </GestureDetector>
  );
}
