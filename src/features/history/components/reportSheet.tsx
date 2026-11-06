import { type HistoryEntry, MAX_REPORT_NOTE_CHARS } from "@getahoy/protocol";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Text } from "@/components/ui/text";
import { historyCopy } from "../copy/historyCopy";
import { reportLines } from "../historyView";

type ReportSheetProps = {
  entry: HistoryEntry;
  open: boolean;
  sending: boolean;
  onSend: (note: string) => void;
  onClose: () => void;
};

export function ReportSheet(props: ReportSheetProps) {
  const { entry, open, sending, onSend, onClose } = props;
  const [note, setNote] = useState("");
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={historyCopy.report}
      description={historyCopy.reportBody}
    >
      <View className="gap-2 rounded-thumb bg-sailcloth p-4">
        {reportLines(entry).map((line) => (
          <View key={line.label} className="gap-0.5">
            <Text variant="eyebrow">{line.label}</Text>
            <Text variant="bodySmall">{line.text}</Text>
          </View>
        ))}
      </View>
      <TextInput
        value={note}
        onChangeText={setNote}
        multiline
        maxLength={MAX_REPORT_NOTE_CHARS}
        accessibilityLabel={historyCopy.reportNote}
        placeholder={historyCopy.reportNote}
        placeholderTextColorClassName="accent-fog"
        cursorColorClassName="accent-signal"
        className="min-h-20 rounded-thumb border border-rope bg-paper px-4 py-3 font-sans text-body text-ink"
      />
      <Button loading={sending} disabled={sending} onPress={() => onSend(note)}>
        <Text>{historyCopy.reportSend}</Text>
      </Button>
      <Button variant="ghost" disabled={sending} onPress={onClose}>
        <Text>{historyCopy.cancel}</Text>
      </Button>
    </Sheet>
  );
}
