import type { HistoryEntry, HistoryFollowUp } from "@getahoy/protocol";
import { ScrollView, View } from "react-native";
import { whyOf } from "../historyView";
import { useEntryActions } from "../hooks/useEntryActions";
import { EntryActions } from "./entryActions";
import { EntryBackBar } from "./entryBackBar";
import { EntryFollowUp } from "./entryFollowUp";
import { EntryHeard } from "./entryHeard";
import { EntryOutcome } from "./entryOutcome";
import { EntryTimings } from "./entryTimings";
import { EntryUnderstood } from "./entryUnderstood";
import { EntryWhy } from "./entryWhy";
import { ReportSheet } from "./reportSheet";
import { RunAgainSheet } from "./runAgainSheet";

const followUpKey = (followUp: HistoryFollowUp) =>
  [followUp.question, followUp.said, followUp.waitedMs].join("|");

export function EntryDetail({ entry }: { entry: HistoryEntry }) {
  const actions = useEntryActions(entry);
  const why = whyOf(entry);
  const close = () => actions.setSheet(null);
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
        <EntryActions
          runAgain={actions.runAction}
          onCopy={actions.copy}
          onReport={() => actions.setSheet("report")}
          onDelete={actions.remove}
        />
      </ScrollView>
      <RunAgainSheet
        open={actions.sheet === "runAgain"}
        heard={entry.heard}
        onRun={actions.run}
        onClose={close}
      />
      <ReportSheet
        entry={entry}
        open={actions.sheet === "report"}
        sending={actions.sending}
        onSend={(note) => void actions.send(note)}
        onClose={close}
      />
    </View>
  );
}
