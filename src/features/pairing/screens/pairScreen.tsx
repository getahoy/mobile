import { useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ActivityIndicator, Linking, View } from "react-native";
import { CameraPermission } from "../components/cameraPermission";
import { ScannerCamera } from "../components/scannerCamera";
import { ScannerStatus } from "../components/scannerStatus";
import { ScannerTopBar } from "../components/scannerTopBar";
import { ScannerViewfinder } from "../components/scannerViewfinder";
import { macCopy } from "../copy/macCopy";
import { pairingCopy } from "../copy/pairingCopy";
import { useClaimMac } from "../hooks/useClaimMac";

export function PairScreen() {
  const { mac } = useLocalSearchParams<{ mac?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const { state, claim, scanAgain } = useClaimMac(() => router.back());
  const close = () => router.back();

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator
          accessibilityLabel={pairingCopy["camera.loading"]}
          colorClassName="accent-muted-foreground"
        />
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <CameraPermission
        blocked={!permission.canAskAgain}
        onAllow={() => void requestPermission()}
        onOpenSettings={() => void Linking.openSettings()}
        onClose={close}
      />
    );
  }
  const hint = mac ? macCopy.pairAgainHint(mac) : pairingCopy["scanner.hint"];
  return (
    <View className="flex-1 bg-scrim">
      <StatusBar style="light" />
      <View className="absolute inset-0">
        <ScannerCamera
          accessibilityLabel={pairingCopy["camera.label"]}
          className="flex-1"
          facing="back"
          enableTorch={torchOn}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={(scan) => {
            if (state.kind === "scanning") void claim(scan.data);
          }}
        />
      </View>
      <ScannerViewfinder hint={hint} />
      <ScannerTopBar
        torchOn={torchOn}
        onClose={close}
        onToggleTorch={() => setTorchOn((on) => !on)}
      />
      <ScannerStatus state={state} onScanAgain={scanAgain} />
    </View>
  );
}
