import type { HistorySection } from "@getahoy/lib";
import type { HistoryEntry } from "@getahoy/protocol";
import type { ReactElement, ReactNode } from "react";
import { RefreshControl, SectionList } from "react-native";
import { Text } from "@/components/ui/text";

type HistoryListProps = {
  sections: readonly HistorySection[];
  top: ReactElement;
  blank: ReactElement | null;
  footer: ReactElement | null;
  refreshing: boolean;
  renderEntry: (entry: HistoryEntry) => ReactNode;
  onEndReached: () => void;
  onRefresh: () => void;
};

export function HistoryList({
  sections,
  top,
  blank,
  footer,
  refreshing,
  renderEntry,
  onEndReached,
  onRefresh,
}: HistoryListProps) {
  return (
    <SectionList
      sections={sections}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColorClassName="accent-driftwood"
          colorsClassName="accent-driftwood"
        />
      }
      keyExtractor={(entry) => entry.id}
      renderItem={({ item }) => renderEntry(item)}
      renderSectionHeader={({ section }) => (
        <Text
          variant="eyebrow"
          role="heading"
          className="bg-sailcloth px-3 pt-5.5 pb-1.5"
        >
          {section.title}
        </Text>
      )}
      ListHeaderComponent={top}
      ListEmptyComponent={blank ?? undefined}
      ListFooterComponent={footer ?? undefined}
      onEndReached={onEndReached}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerClassName="grow px-2 pb-safe-offset-8"
    />
  );
}
