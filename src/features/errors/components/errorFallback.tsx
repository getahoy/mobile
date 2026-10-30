import { authCopy, errorMessages } from "@getahoy/lib";
import type { ErrorBoundaryProps } from "expo-router";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export function ErrorFallback({ retry }: ErrorBoundaryProps) {
  return (
    <View className="flex-1 justify-center gap-6 bg-sailcloth px-5">
      <Text variant="title" role="alert" className="text-center">
        {errorMessages.internal}
      </Text>
      <Button onPress={retry}>
        <Text>{authCopy["action.retry"]}</Text>
      </Button>
    </View>
  );
}
