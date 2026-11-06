import { WaitingState } from "@/components/ui/waitingState";
import { historyCopy } from "../copy/historyCopy";

export function HistoryLoading({ busy }: { busy: boolean }) {
  return (
    <WaitingState
      busy={busy}
      message={historyCopy.loading}
      slowMessage={historyCopy.loadingSlow}
      slowHint={historyCopy.loadingSlowHint}
    />
  );
}
