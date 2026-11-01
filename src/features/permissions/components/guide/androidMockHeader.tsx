import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type AndroidMockHeaderProps = { title: string };

export function AndroidMockHeader({ title }: AndroidMockHeaderProps) {
  return (
    <View className="absolute top-4 left-4 flex-row items-center gap-2.5">
      <Icon name="arrowLeft" size="sm" />
      <Text variant="bodySmall" className="font-sans-medium">
        {title}
      </Text>
    </View>
  );
}
