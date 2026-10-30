import { useRef } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Text } from "@/components/ui/text";
import { macCopy } from "../copy/macCopy";
import type { MacCardAction } from "../hooks/useMacCardActions";
import type { PairedMac } from "../storage/pairedMacs";
import { TalkToRow } from "./talkToRow";

type MoreOptionsSheetProps = {
  open: boolean;
  mac: PairedMac;
  statusLine: string;
  macs: readonly PairedMac[];
  onSelect: (publicKey: string) => void;
  link: MacCardAction | null;
  onRemove: () => void;
  onClose: () => void;
};

export function MoreOptionsSheet(props: MoreOptionsSheetProps) {
  const { open, mac, statusLine, macs, link, onClose } = props;
  const choices = macs.filter((candidate) => !candidate.ended);
  const afterClose = useRef<(() => void) | null>(null);
  const run = (action: () => void) => () => {
    onClose();
    action();
  };
  const removeAfterClose = () => {
    afterClose.current = props.onRemove;
    onClose();
  };
  return (
    <Sheet
      open={open}
      onClose={onClose}
      onClosed={() => {
        afterClose.current?.();
        afterClose.current = null;
      }}
      title={mac.displayName}
      description={statusLine}
    >
      {choices.length > 1 ? (
        <View className="gap-1 pb-2">
          <Text variant="eyebrow" role="heading" className="pl-1">
            {macCopy.talkTo}
          </Text>
          {choices.map((choice) => (
            <TalkToRow
              key={choice.publicKey}
              mac={choice}
              selected={choice.publicKey === mac.publicKey}
              onSelect={(publicKey) => {
                onClose();
                props.onSelect(publicKey);
              }}
            />
          ))}
        </View>
      ) : null}
      {link ? (
        <Button onPress={run(link.onPress)}>
          <Text>{link.label}</Text>
        </Button>
      ) : null}
      <Button variant="outline" onPress={removeAfterClose}>
        <Text className="text-flare">{macCopy.removeMac}</Text>
      </Button>
      <Button variant="ghost" onPress={onClose}>
        <Text>{macCopy.cancel}</Text>
      </Button>
    </Sheet>
  );
}
