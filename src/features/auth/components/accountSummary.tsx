import { authCopy } from "@getahoy/lib";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

type AccountSummaryProps = {
  name: string;
  email: string;
};

export function AccountSummary({ name, email }: AccountSummaryProps) {
  return (
    <View className="gap-2">
      <Text className="text-muted-foreground text-sm">
        {authCopy["field.name"]}
      </Text>
      <Text>{name}</Text>
      <Text className="text-muted-foreground text-sm">
        {authCopy["field.email"]}
      </Text>
      <Text>{email}</Text>
    </View>
  );
}
