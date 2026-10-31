import { useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Linking, View } from "react-native";
import { CameraPermission } from "../components/cameraPermission";
import { ScannerPreview } from "../components/scannerPreview";
import { ScannerStatus } from "../components/scannerStatus";
import { ScannerTopBar } from "../components/scannerTopBar";
import { ScannerViewfinder } from "../components/scannerViewfinder";
import { ScannerZoom } from "../components/scannerZoom";
import { macCopy } from "../copy/macCopy";
import { pairingCopy } from "../copy/pairingCopy";
import { useClaimMac } from "../hooks/useClaimMac";
import { useScannerZoom } from "../hooks/useScannerZoom";

export function PairScreen() {
  const { mac } = useLocalSearchParams<{ mac?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const { state, claim, scanAgain } = useClaimMac(() => router.back());
  const zoom = useScannerZoom();
  const close = () => router.back();
  const scanAgainFromStart = () => {
    zoom.reset();
    scanAgain();
  };

  if (!permission) {
    return (
      <View
        accessibilityLabel={pairingCopy["camera.loading"]}
        className="flex-1 bg-sailcloth"
      />
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
      <ScannerPreview
        torchOn={torchOn}
        cameraZoom={zoom.cameraZoom}
        pinch={zoom.pinch}
        onScan={(code) => {
          if (state.kind === "scanning") void claim(code);
        }}
      />
      <ScannerViewfinder hint={hint} />
      <ScannerZoom zoom={zoom} visible={state.kind === "scanning"} />
      <ScannerTopBar
        torchOn={torchOn}
        onClose={close}
        onToggleTorch={() => setTorchOn((on) => !on)}
      />
      <ScannerStatus state={state} onScanAgain={scanAgainFromStart} />
    </View>
  );
}
