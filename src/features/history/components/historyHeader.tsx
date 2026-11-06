import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { historyCopy } from "../copy/historyCopy";

export function HistoryHeader({ trailing }: { trailing: ReactNode }) {
  return (
    <View className="h-14 flex-row items-center gap-1 pr-4 pl-2">
      <Pressable
        role="button"
        accessibilityLabel={historyCopy.back}
        onPress={() => router.back()}
        className="size-11 items-center justify-center rounded-full active:bg-linen"
      >
        <Icon name="chevronLeft" size="lg" />
      </Pressable>
      <Text variant="title" className="flex-1">
        {historyCopy.title}
      </Text>
      {trailing}
    </View>
  );
}
