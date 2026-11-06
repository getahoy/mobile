import { EntryDetail } from "../components/entryDetail";
import { useHistory } from "../hooks/historyContext";

export function HistoryEntryScreen({ id }: { id: string }) {
  const { entries } = useHistory();
  const entry = entries.find((candidate) => candidate.id === id);
  return entry ? <EntryDetail entry={entry} /> : null;
}
