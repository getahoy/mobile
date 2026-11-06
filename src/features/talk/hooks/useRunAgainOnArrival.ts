import { router } from "expo-router";
import { useEffect } from "react";
import type { TalkFlow } from "../sending/talkFlow";

// History hands the words over through the route, so they run once the Mac is ready to talk.
export function useRunAgainOnArrival(
  flow: TalkFlow,
  again: string | null,
  blocked: boolean,
): void {
  useEffect(() => {
    if (!again || blocked) return;
    router.setParams({ again: undefined });
    flow.runText(again);
  }, [flow, again, blocked]);
}
