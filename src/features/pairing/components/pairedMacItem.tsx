import { useMacConnection } from "../hooks/useMacConnection";
import type { PairedMac } from "../storage/pairedMacs";
import { MacLinkStatus } from "./macLinkStatus";

type PairedMacItemProps = { mac: PairedMac };

export function PairedMacItem({ mac }: PairedMacItemProps) {
  const { state, retry } = useMacConnection(mac);
  return (
    <MacLinkStatus macName={mac.displayName} state={state} onRetry={retry} />
  );
}
