import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { PermissionGateView } from "@/features/permissions/components/permissionGateView";
import { TurnedOnPill } from "@/features/permissions/components/turnedOnPill";
import { localNetworkIntroPending } from "@/features/permissions/localNetworkIntro";
import { ScannerPreview } from "../components/scannerPreview";
import { ScannerStatus } from "../components/scannerStatus";
import { ScannerTopBar } from "../components/scannerTopBar";
import { ScannerViewfinder } from "../components/scannerViewfinder";
import { ScannerZoom } from "../components/scannerZoom";
import { macCopy } from "../copy/macCopy";
import { pairingCopy } from "../copy/pairingCopy";
import { useCameraGate } from "../hooks/useCameraGate";
import { useClaimMac } from "../hooks/useClaimMac";
import { useScannerZoom } from "../hooks/useScannerZoom";

const close = () => router.back();

function leaveAfterPairing() {
  if (localNetworkIntroPending()) router.replace("/local-network");
  else router.back();
}

export function PairScreen() {
  const { mac, resumed } = useLocalSearchParams<{
    mac?: string;
    resumed?: string;
  }>();
  const camera = useCameraGate(resumed === "1");
  const [torchOn, setTorchOn] = useState(false);
  const { state, claim, scanAgain } = useClaimMac(leaveAfterPairing);
  const zoom = useScannerZoom();
  const scanAgainFromStart = () => {
    zoom.reset();
    scanAgain();
  };

  if (camera.gate.screen !== "granted") {
    return (
      <PermissionGateView kind="camera" gate={camera.gate} onClose={close} />
    );
  }
  const hint = mac ? macCopy.pairAgainHint(mac) : pairingCopy["scanner.hint"];
  const notice = camera.turnedOn ? (
    <TurnedOnPill kind="camera" look="scanner" onHidden={camera.settle} />
  ) : null;
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
        onCameraFailed={camera.gate.fail}
      />
      <ScannerViewfinder hint={hint} />
      <ScannerZoom zoom={zoom} visible={state.kind === "scanning"} />
      <ScannerTopBar
        torchOn={torchOn}
        notice={notice}
        onClose={close}
        onToggleTorch={() => setTorchOn((on) => !on)}
      />
      <ScannerStatus state={state} onScanAgain={scanAgainFromStart} />
    </View>
  );
}
