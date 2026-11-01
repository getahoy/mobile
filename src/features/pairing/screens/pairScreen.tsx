import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
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
import type { EndedNotice } from "../endedPairing";
import { useCameraGate } from "../hooks/useCameraGate";
import { useClaimMac } from "../hooks/useClaimMac";
import { useScannerZoom } from "../hooks/useScannerZoom";
import { useEndedNotice } from "../storage/endedNotice";

const close = () => router.back();

function leaveAfterPairing() {
  if (localNetworkIntroPending()) router.replace("/local-network");
  else router.back();
}

function scannerHint(mac: string | undefined, ended: EndedNotice | null) {
  if (mac) return macCopy.pairAgainHint(mac);
  if (!ended) return pairingCopy["scanner.hint"];
  return (
    <>
      {macCopy.endedScanBefore}
      <Text className="font-sans-medium text-on-scrim">{ended.deviceName}</Text>
      {macCopy.endedScanAfter}
    </>
  );
}

export function PairScreen() {
  const { mac, resumed } = useLocalSearchParams<{
    mac?: string;
    resumed?: string;
  }>();
  const camera = useCameraGate(resumed === "1");
  const ended = useEndedNotice().notice;
  const [torchOn, setTorchOn] = useState(false);
  const { state, claim } = useClaimMac(leaveAfterPairing);
  const zoom = useScannerZoom();
  const cameraLive = state.kind === "scanning" || state.kind === "failed";

  if (camera.gate.screen !== "granted") {
    return (
      <PermissionGateView kind="camera" gate={camera.gate} onClose={close} />
    );
  }
  const hint = scannerHint(mac, ended);
  const notice = camera.turnedOn ? (
    <TurnedOnPill kind="camera" look="scanner" onHidden={camera.hideTurnedOn} />
  ) : null;
  return (
    <View className="flex-1 bg-scrim">
      <StatusBar style="light" />
      <ScannerPreview
        torchOn={torchOn}
        cameraZoom={zoom.cameraZoom}
        pinch={zoom.pinch}
        onScan={(code) => void claim(code)}
        onCameraFailed={camera.gate.fail}
      />
      <ScannerViewfinder hint={hint} />
      <ScannerZoom zoom={zoom} visible={cameraLive} />
      <ScannerTopBar
        torchOn={torchOn}
        notice={notice}
        onClose={close}
        onToggleTorch={() => setTorchOn((on) => !on)}
      />
      <ScannerStatus state={state} />
    </View>
  );
}
