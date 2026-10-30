import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Text } from "@/components/ui/text";
import type { MacCardAction } from "../hooks/useMacCardActions";

type MacActionsSheetProps = {
  open: boolean;
  title: string;
  message: string;
  actions: readonly MacCardAction[];
  onClose: () => void;
};

export function MacActionsSheet(props: MacActionsSheetProps) {
  const { open, title, message, actions, onClose } = props;
  return (
    <Sheet open={open} onClose={onClose} title={title} description={message}>
      {actions.map((action) => (
        <Button
          key={action.label}
          variant={action.tone}
          onPress={() => {
            onClose();
            action.onPress();
          }}
        >
          <Text>{action.label}</Text>
        </Button>
      ))}
    </Sheet>
  );
}
