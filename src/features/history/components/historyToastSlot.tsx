import { useHistory } from "../hooks/historyContext";
import { HistoryToast } from "./historyToast";

export function HistoryToastSlot() {
  const { toasts } = useHistory();
  const undo = () => {
    toasts.toast?.undo?.();
    toasts.dismiss();
  };
  return <HistoryToast toast={toasts.toast} onUndo={undo} />;
}
