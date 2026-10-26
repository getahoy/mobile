import type { PairedMac } from "../storage/pairedMacs";
import { EndedMacCard } from "./endedMacCard";
import { LiveMacCard } from "./liveMacCard";

type PairedMacItemProps = { mac: PairedMac; onChanged: () => void };

export function PairedMacItem({ mac, onChanged }: PairedMacItemProps) {
  if (mac.ended) {
    return (
      <EndedMacCard
        mac={mac}
        reason={mac.ended.reason}
        onDismissed={onChanged}
      />
    );
  }
  return <LiveMacCard mac={mac} onChanged={onChanged} />;
}
