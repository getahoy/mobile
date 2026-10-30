import { useEffect } from "react";
import { haptics } from "@/lib/haptics";
import { Button } from "./button";
import { Sheet } from "./sheet";
import { Text } from "./text";

export type ConfirmRequest = {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

type ConfirmSheetProps = { request: ConfirmRequest | null };

export function ConfirmSheet({ request }: ConfirmSheetProps) {
  const open = request !== null;
  useEffect(() => {
    if (open) haptics.confirmOpen();
  }, [open]);
  return (
    <Sheet
      open={open}
      onClose={() => request?.onCancel()}
      tone="danger"
      title={request?.title ?? ""}
      description={request?.body ?? ""}
    >
      <Button variant="destructive" onPress={() => request?.onConfirm()}>
        <Text>{request?.confirmLabel}</Text>
      </Button>
      <Button variant="ghost" onPress={() => request?.onCancel()}>
        <Text>{request?.cancelLabel}</Text>
      </Button>
    </Sheet>
  );
}
