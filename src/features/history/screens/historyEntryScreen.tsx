import { View } from "react-native";
import { EntryBackBar } from "../components/entryBackBar";
import { EntryDetail } from "../components/entryDetail";
import { useHistory } from "../hooks/historyContext";

// An entry can leave the list while open (cleared elsewhere, refetched); the way back stays.
export function HistoryEntryScreen({ id }: { id: string }) {
  const { entries } = useHistory();
  const entry = entries.find((candidate) => candidate.id === id);
  if (entry) return <EntryDetail entry={entry} />;
  return (
    <View className="flex-1 bg-sailcloth pt-safe">
      <EntryBackBar />
    </View>
  );
}
