import { OptionRow } from "@/components/ui/optionRow";
import { macCopy } from "../copy/macCopy";
import { useMacLink } from "../hooks/useMacLink";
import { macStatus } from "../macStatus";
import type { PairedMac } from "../storage/pairedMacs";

type TalkToRowProps = {
  mac: PairedMac;
  selected: boolean;
  onSelect: (publicKey: string) => void;
};

export function TalkToRow({ mac, selected, onSelect }: TalkToRowProps) {
  const { state } = useMacLink(mac);
  const { chip } = macStatus(state, mac.displayName);
  return (
    <OptionRow
      label={mac.displayName}
      help={chip || macCopy.connectedWord}
      selected={selected}
      onPress={() => onSelect(mac.publicKey)}
    />
  );
}
