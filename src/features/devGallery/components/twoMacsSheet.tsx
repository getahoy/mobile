import { useState } from "react";
import { MoreOptionsSheet } from "@/features/pairing/components/moreOptionsSheet";
import { macCopy } from "@/features/pairing/copy/macCopy";
import type { PairedMac } from "@/features/pairing/storage/pairedMacs";
import { galleryCopy } from "../copy/galleryCopy";

const sampleMac = (publicKey: string, displayName: string): PairedMac => ({
  publicKey,
  displayName,
  lastKnownAddresses: [],
  lanPort: null,
  pairedAt: 0,
  paused: false,
  ended: null,
});

const macs = [
  sampleMac("A".repeat(43), galleryCopy.macName),
  sampleMac("B".repeat(43), galleryCopy.secondMacName),
];

type TwoMacsSheetProps = { open: boolean; onClose: () => void };

export function TwoMacsSheet({ open, onClose }: TwoMacsSheetProps) {
  const [selected, setSelected] = useState(0);
  const mac = macs[selected] ?? macs[0];
  if (!mac) return null;
  return (
    <MoreOptionsSheet
      open={open}
      mac={mac}
      statusLine={macCopy.connected}
      macs={macs}
      onSelect={(key) =>
        setSelected(macs.findIndex((m) => m.publicKey === key))
      }
      link={{ label: macCopy.disconnect, tone: "primary", onPress: onClose }}
      onRemove={onClose}
      onClose={onClose}
    />
  );
}
