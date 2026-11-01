import { router } from "expo-router";
import type { ReactNode } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { homeCopy } from "../copy/homeCopy";
import { HomeHeader } from "./homeHeader";

type NoMacsYetProps = { notice: ReactNode };

export function NoMacsYet({ notice }: NoMacsYetProps) {
  return (
    <View className="flex-1 bg-sailcloth pt-safe">
      <HomeHeader
        chip={
          <Text variant="title" className="pl-1">
            {homeCopy.wordmark}
          </Text>
        }
      />
      <View className="flex-1 justify-center gap-3 px-8 pb-10">
        {notice}
        <Text variant="title">{homeCopy.emptyTitle}</Text>
        <Text className="text-driftwood">{homeCopy.emptyBody}</Text>
      </View>
      <View className="px-5 pb-safe-offset-2">
        <Button
          className="active:scale-97 active:opacity-100"
          onPress={() => router.push("/pair")}
        >
          <Text>{homeCopy.scan}</Text>
        </Button>
      </View>
    </View>
  );
}
