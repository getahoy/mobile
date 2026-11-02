import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { PermissionGateView } from "@/features/permissions/components/permissionGateView";
import { TurnedOnPill } from "@/features/permissions/components/turnedOnPill";
import { localNetworkIntroPending } from "@/features/permissions/localNetworkIntro";
import {
  type ScannerHint,
  ScannerMessageSlot,
} from "../components/scannerMessageSlot";
import { ScannerPreview } from "../components/scannerPreview";
import { ScannerTopBar } from "../components/scannerTopBar";
import { ScannerViewfinder } from "../components/scannerViewfinder";
import { ScannerZoom } from "../components/scannerZoom";
import { macCopy } from "../copy/macCopy";
import { pairingCopy } from "../copy/pairingCopy";
import type { EndedNotice } from "../endedPairing";
import { useCameraGate } from "../hooks/useCameraGate";
import { usePairScanner } from "../hooks/usePairScanner";
import { useScannerZoom } from "../hooks/useScannerZoom";
import { useEndedNotice } from "../storage/endedNotice";

const close = () => router.back();

function leaveAfterPairing() {
  if (localNetworkIntroPending()) router.replace("/local-network");
  else router.back();
}

function scannerHint(
  mac: string | undefined,
  ended: EndedNotice | null,
): ScannerHint {
  if (mac) {
    const label = macCopy.pairAgainHint(mac);
    return { label, content: label };
  }
  if (!ended) {
    const label = pairingCopy["scanner.hint"];
    return { label, content: label };
  }
  const { endedScanBefore, endedScanAfter } = macCopy;
  return {
    label: `${endedScanBefore}${ended.deviceName}${endedScanAfter}`,
    content: (
      <>
        {endedScanBefore}
        <Text className="font-sans-medium text-on-scrim">
          {ended.deviceName}
        </Text>
        {endedScanAfter}
      </>
    ),
  };
}

export function PairScreen() {
  const { mac, resumed } = useLocalSearchParams<{
    mac?: string;
    resumed?: string;
  }>();
  const camera = useCameraGate(resumed === "1");
  const ended = useEndedNotice().notice;
  const [torchOn, setTorchOn] = useState(false);
  const scanner = usePairScanner(leaveAfterPairing);
  const zoom = useScannerZoom();

  if (camera.gate.screen !== "granted") {
    return (
      <PermissionGateView kind="camera" gate={camera.gate} onClose={close} />
    );
  }
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
        onScan={scanner.scan}
        onCameraFailed={camera.gate.fail}
      />
      <ScannerViewfinder dimmed={!scanner.scanning} />
      <ScannerZoom zoom={zoom} visible={scanner.scanning} />
      <ScannerTopBar
        torchOn={torchOn}
        notice={notice}
        onClose={close}
        onToggleTorch={() => setTorchOn((on) => !on)}
      />
      <ScannerMessageSlot
        state={scanner.state}
        hint={scannerHint(mac, ended)}
        signingIn={scanner.signingIn}
        onAction={scanner.act}
      />
    </View>
  );
}
