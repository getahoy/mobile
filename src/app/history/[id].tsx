import { useLocalSearchParams } from "expo-router";
import { HistoryEntryScreen } from "@/features/history/screens/historyEntryScreen";

export default function HistoryEntryRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <HistoryEntryScreen id={id} />;
}
