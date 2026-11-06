import { View } from "react-native";
import { OptionRow } from "@/components/ui/optionRow";
import { Sheet } from "@/components/ui/sheet";
import type { PairedMac } from "@/features/pairing/storage/pairedMacs";
import { historyCopy } from "../copy/historyCopy";

type MacPickerSheetProps = {
  open: boolean;
  macs: readonly PairedMac[];
  selected: string | null;
  onPick: (macKey: string | null) => void;
  onClose: () => void;
};

export function MacPickerSheet({
  open,
  macs,
  selected,
  onPick,
  onClose,
}: MacPickerSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} title={historyCopy.showHistoryFor}>
      <View role="radiogroup" accessibilityLabel={historyCopy.showHistoryFor}>
        <OptionRow
          label={historyCopy.allMacs}
          help={historyCopy.macCount(macs.length)}
          selected={selected === null}
          onPress={() => onPick(null)}
        />
        {macs.map((mac) => (
          <OptionRow
            key={mac.publicKey}
            label={mac.displayName || historyCopy.unnamedMac}
            selected={selected === mac.publicKey}
            onPress={() => onPick(mac.publicKey)}
          />
        ))}
      </View>
    </Sheet>
  );
}
