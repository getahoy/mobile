import { type SocialProviderId, socialProviderCatalog } from "@getahoy/lib";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

type SocialSignInButtonsProps = {
  pending: boolean;
  onSelect: (provider: SocialProviderId) => void;
};

export function SocialSignInButtons({
  pending,
  onSelect,
}: SocialSignInButtonsProps) {
  return (
    <View className="gap-2">
      {socialProviderCatalog.map((provider) => (
        <Button
          key={provider.id}
          variant="outline"
          disabled={pending}
          onPress={() => onSelect(provider.id)}
        >
          <Text>{provider.label}</Text>
        </Button>
      ))}
    </View>
  );
}
