import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Text } from "@/components/ui/text";
import { historyCopy } from "../copy/historyCopy";

type RunAgainSheetProps = {
  open: boolean;
  heard: string;
  onRun: () => void;
  onClose: () => void;
};

export function RunAgainSheet({
  open,
  heard,
  onRun,
  onClose,
}: RunAgainSheetProps) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={historyCopy.confirmRunTitle}
      description={historyCopy.confirmRunBody(heard)}
    >
      <Button onPress={onRun}>
        <Text>{historyCopy.confirmRun}</Text>
      </Button>
      <Button variant="ghost" onPress={onClose}>
        <Text>{historyCopy.cancel}</Text>
      </Button>
    </Sheet>
  );
}
