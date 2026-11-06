import type { HistoryFilter } from "@getahoy/protocol";
import { View } from "react-native";
import { Banner } from "@/components/ui/banner";
import { Text } from "@/components/ui/text";
import { HistoryFilters } from "./historyFilters";
import { HistorySearch } from "./historySearch";

type HistoryListTopProps = {
  notice: string | null;
  summary: string | null;
  search: string;
  filter: HistoryFilter;
  onSearch: (text: string) => void;
  onFilter: (filter: HistoryFilter) => void;
};

export function HistoryListTop({
  notice,
  summary,
  search,
  filter,
  onSearch,
  onFilter,
}: HistoryListTopProps) {
  return (
    <View className="gap-3 px-4 pb-2">
      <Banner message={notice} />
      {summary ? (
        <Text variant="bodySmall" className="px-1 pt-1 text-driftwood">
          {summary}
        </Text>
      ) : null}
      <HistorySearch value={search} onChange={onSearch} />
      <HistoryFilters filter={filter} onChange={onFilter} />
    </View>
  );
}
