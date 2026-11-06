import type { HistoryEntry } from "@getahoy/protocol";
import { router } from "expo-router";
import { useSyncExternalStore } from "react";
import { useLiveMacLinks } from "@/features/pairing/hooks/useLiveMacLinks";
import { useSelectedMac } from "@/features/pairing/storage/selectedMac";

// Home runs it, so the reply, any question back and the history entry all work as usual.
export function useRunAgain(entry: HistoryEntry) {
  const live = useLiveMacLinks();
  const { select } = useSelectedMac();
  const { macKey } = entry;
  const link = useSyncExternalStore(live.onChange, () =>
    macKey ? live.state(macKey) : null,
  );
  const ready = link?.kind === "connected" && !link.locked;
  const run = () => {
    if (!macKey || !ready) return;
    select(macKey);
    router.dismissTo({ pathname: "/", params: { again: entry.heard } });
  };
  return { shown: entry.status !== "blocked", ready, run };
}
