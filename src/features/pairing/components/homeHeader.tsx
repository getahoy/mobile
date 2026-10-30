import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { homeCopy } from "../copy/homeCopy";

type HomeHeaderProps = { chip?: ReactNode };

export function HomeHeader({ chip }: HomeHeaderProps) {
  return (
    <View className="h-14 flex-row items-center justify-between gap-2 pr-2.5 pl-4">
      {chip ?? <View />}
      <Pressable
        role="button"
        accessibilityLabel={homeCopy.account}
        onPress={() => router.push("/account")}
        className="size-11 items-center justify-center rounded-full active:bg-linen"
      >
        <Icon name="account" size="lg" />
      </Pressable>
    </View>
  );
}
