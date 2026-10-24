import { router } from "expo-router";
import { useMacConnection } from "../hooks/useMacConnection";
import { useUnpairMac } from "../hooks/useUnpairMac";
import type { PairedMac } from "../storage/pairedMacs";
import { MacLinkStatus } from "./macLinkStatus";

type PairedMacItemProps = { mac: PairedMac; onRemoved: () => void };

export function PairedMacItem({ mac, onRemoved }: PairedMacItemProps) {
  const { state, retry } = useMacConnection(mac);
  const confirmRemove = useUnpairMac(mac, onRemoved);
  return (
    <MacLinkStatus
      macName={mac.displayName}
      state={state}
      onRetry={retry}
      onPairAgain={() => router.push("/pair")}
      onRemove={confirmRemove}
    />
  );
}
