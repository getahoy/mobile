import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Text } from "@/components/ui/text";
import { historyCopy } from "../copy/historyCopy";

type ClearHistorySheetProps = {
  open: boolean;
  clearing: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ClearHistorySheet({
  open,
  clearing,
  onConfirm,
  onClose,
}: ClearHistorySheetProps) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={historyCopy.clearTitle}
      description={historyCopy.clearBody}
    >
      <Button
        variant="destructive"
        loading={clearing}
        disabled={clearing}
        onPress={onConfirm}
      >
        <Text>{historyCopy.clearConfirm}</Text>
      </Button>
      <Button variant="ghost" disabled={clearing} onPress={onClose}>
        <Text>{historyCopy.cancel}</Text>
      </Button>
    </Sheet>
  );
}
