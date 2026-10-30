import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { pairingCopy } from "../copy/pairingCopy";

type ScannerTopBarProps = {
  torchOn: boolean;
  onClose: () => void;
  onToggleTorch: () => void;
};

const roundButton = "size-11 items-center justify-center rounded-full bg-scrim";

export function ScannerTopBar({
  torchOn,
  onClose,
  onToggleTorch,
}: ScannerTopBarProps) {
  return (
    <View className="absolute inset-x-0 top-0 flex-row items-center justify-between px-4 pt-safe-offset-2">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={pairingCopy["scanner.close"]}
        onPress={onClose}
        className={roundButton}
      >
        <Icon name="close" size="lg" tintColorClassName="accent-on-scrim" />
      </Pressable>
      <Text className="font-sans-medium text-on-scrim">
        {pairingCopy["scanner.title"]}
      </Text>
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: torchOn }}
        accessibilityLabel={pairingCopy["scanner.torch"]}
        onPress={onToggleTorch}
        className={roundButton}
      >
        <Icon
          name={torchOn ? "torchOn" : "torchOff"}
          size="lg"
          tintColorClassName="accent-on-scrim"
        />
      </Pressable>
    </View>
  );
}
