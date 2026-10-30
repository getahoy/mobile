import { OptionRow } from "@/components/ui/optionRow";
import { Sheet } from "@/components/ui/sheet";

export type VoiceOption<Key extends string> = {
  key: Key;
  label: string;
  help: string;
};

type VoiceOptionSheetProps<Key extends string> = {
  open: boolean;
  title: string;
  options: readonly VoiceOption<Key>[];
  selected: Key;
  onSelect: (key: Key) => void;
  onClose: () => void;
};

export function VoiceOptionSheet<Key extends string>(
  props: VoiceOptionSheetProps<Key>,
) {
  const { open, title, options, selected, onSelect, onClose } = props;
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      {options.map((option) => (
        <OptionRow
          key={option.key}
          label={option.label}
          help={option.help}
          selected={option.key === selected}
          onPress={() => {
            onSelect(option.key);
            onClose();
          }}
        />
      ))}
    </Sheet>
  );
}
