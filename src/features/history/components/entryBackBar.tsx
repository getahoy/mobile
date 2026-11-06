import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { historyCopy } from "../copy/historyCopy";

export function EntryBackBar() {
  return (
    <View className="h-14 flex-row items-center px-2.5">
      <Pressable
        role="button"
        accessibilityLabel={historyCopy.back}
        onPress={() => router.back()}
        className="h-11 flex-row items-center gap-0.5 rounded-full pr-3 pl-1 active:bg-linen"
      >
        <Icon name="chevronLeft" size="lg" />
        <Text>{historyCopy.backToHistory}</Text>
      </Pressable>
    </View>
  );
}
