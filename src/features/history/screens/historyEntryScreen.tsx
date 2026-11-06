import type { HistoryFollowUp } from "@getahoy/protocol";
import { setStringAsync } from "expo-clipboard";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { EntryActions } from "../components/entryActions";
import { EntryBackBar } from "../components/entryBackBar";
import { EntryFollowUp } from "../components/entryFollowUp";
import { EntryHeard } from "../components/entryHeard";
import { EntryOutcome } from "../components/entryOutcome";
import { EntryTimings } from "../components/entryTimings";
import { EntryUnderstood } from "../components/entryUnderstood";
import { EntryWhy } from "../components/entryWhy";
import { historyCopy } from "../copy/historyCopy";
import { whyOf } from "../historyView";
import { useHistory } from "../hooks/historyContext";

const followUpKey = (followUp: HistoryFollowUp) =>
  [followUp.question, followUp.said, followUp.waitedMs].join("|");

export function HistoryEntryScreen({ id }: { id: string }) {
  const history = useHistory();
  const entry = history.entries.find((candidate) => candidate.id === id);
  if (!entry) return null;
  const why = whyOf(entry);
  const copied = { text: historyCopy.copied, undo: null };
  const copy = () => {
    const text = historyCopy.copiedText(entry.heard, entry.did);
    void setStringAsync(text).then(() => history.toasts.show(copied));
  };
  const remove = () => {
    router.back();
    void history.deleteEntry(entry.id);
  };
  return (
    <View className="flex-1 bg-sailcloth pt-safe">
      <EntryBackBar />
      <ScrollView contentContainerClassName="gap-7.5 px-6 pt-2 pb-safe-offset-10">
        <EntryHeard entry={entry} />
        {entry.followUps.map((followUp) => (
          <EntryFollowUp key={followUpKey(followUp)} followUp={followUp} />
        ))}
        <EntryOutcome entry={entry} />
        {why ? <EntryWhy label={why.label} text={why.text} /> : null}
        <EntryTimings timings={entry.timings} />
        {entry.via ? <EntryUnderstood via={entry.via} /> : null}
        <EntryActions onCopy={copy} onDelete={remove} />
      </ScrollView>
    </View>
  );
}
