import { Pressable, TextInput, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { historyCopy } from "../copy/historyCopy";

type HistorySearchProps = { value: string; onChange: (text: string) => void };

export function HistorySearch({ value, onChange }: HistorySearchProps) {
  return (
    <View className="h-11 flex-row items-center gap-2.5 rounded-full bg-linen pr-2 pl-4">
      <Icon name="search" size="sm" tintColorClassName="accent-driftwood" />
      <TextInput
        value={value}
        onChangeText={onChange}
        accessibilityLabel={historyCopy.searchLabel}
        placeholder={historyCopy.searchPlaceholder}
        placeholderTextColorClassName="accent-driftwood"
        selectionColorClassName="accent-signal"
        cursorColorClassName="accent-signal"
        returnKeyType="search"
        autoCorrect={false}
        className="h-full flex-1 font-sans text-body text-ink"
      />
      {value ? (
        <Pressable
          role="button"
          accessibilityLabel={historyCopy.clearSearch}
          onPress={() => onChange("")}
          className="size-7 items-center justify-center rounded-full active:bg-rope"
        >
          <Icon name="close" size="xs" tintColorClassName="accent-driftwood" />
        </Pressable>
      ) : null}
    </View>
  );
}
