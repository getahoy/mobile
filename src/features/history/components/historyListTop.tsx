import type { HistoryFilter } from "@getahoy/protocol";
import { View } from "react-native";
import { Banner } from "@/components/ui/banner";
import { HistoryFilters } from "./historyFilters";
import { HistorySearch } from "./historySearch";
import { HistorySummary } from "./historySummary";

type HistoryListTopProps = {
  notice: string | null;
  summary: string | null;
  summaryPending: boolean;
  search: string;
  filter: HistoryFilter;
  onSearch: (text: string) => void;
  onFilter: (filter: HistoryFilter) => void;
};

export function HistoryListTop({
  notice,
  summary,
  summaryPending,
  search,
  filter,
  onSearch,
  onFilter,
}: HistoryListTopProps) {
  return (
    <View className="gap-3 px-4 pb-2">
      <Banner message={notice} />
      <HistorySummary text={summary} pending={summaryPending} />
      <HistorySearch value={search} onChange={onSearch} />
      <HistoryFilters filter={filter} onChange={onFilter} />
    </View>
  );
}
