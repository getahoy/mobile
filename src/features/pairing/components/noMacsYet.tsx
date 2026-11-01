import { router } from "expo-router";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { homeCopy } from "../copy/homeCopy";
import type { EndedNotice } from "../endedPairing";
import { EndedMessage } from "./endedMessage";
import { HomeHeader } from "./homeHeader";

type NoMacsYetProps = { ended: EndedNotice | null };

export function NoMacsYet({ ended }: NoMacsYetProps) {
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
        {ended ? (
          <EndedMessage notice={ended} />
        ) : (
          <>
            <Text variant="title">{homeCopy.emptyTitle}</Text>
            <Text className="text-driftwood">{homeCopy.emptyBody}</Text>
          </>
        )}
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
