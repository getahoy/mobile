import { HISTORY_FILTERS, type HistoryFilter } from "@getahoy/protocol";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { historyCopy } from "../copy/historyCopy";

type HistoryFiltersProps = {
  filter: HistoryFilter;
  onChange: (filter: HistoryFilter) => void;
};

export function HistoryFilters({ filter, onChange }: HistoryFiltersProps) {
  return (
    <View
      role="tablist"
      accessibilityLabel={historyCopy.filterLabel}
      className="flex-row rounded-full bg-linen p-0.5"
    >
      {HISTORY_FILTERS.map((option) => {
        const selected = option === filter;
        return (
          <Pressable
            key={option}
            role="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option)}
            className={cn(
              "h-9 flex-1 items-center justify-center rounded-full",
              selected && "bg-paper",
            )}
          >
            <Text
              variant="bodySmall"
              className={cn(
                "font-sans-medium",
                selected ? "text-ink" : "text-driftwood",
              )}
            >
              {historyCopy.filters[option]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
