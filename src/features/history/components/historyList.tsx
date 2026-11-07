import type { HistoryEntry } from "@getahoy/protocol";
import type { ReactElement, ReactNode } from "react";
import { SectionList } from "react-native";
import { Text } from "@/components/ui/text";
import type { HistorySection } from "../historyView";

type HistoryListProps = {
  sections: readonly HistorySection[];
  top: ReactElement;
  blank: ReactElement | null;
  footer: ReactElement | null;
  renderEntry: (entry: HistoryEntry) => ReactNode;
  onEndReached: () => void;
};

export function HistoryList({
  sections,
  top,
  blank,
  footer,
  renderEntry,
  onEndReached,
}: HistoryListProps) {
  return (
    <SectionList
      sections={sections}
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
      contentContainerClassName="px-2 pb-safe-offset-8"
    />
  );
}
