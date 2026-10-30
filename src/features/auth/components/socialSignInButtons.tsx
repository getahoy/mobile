import { type SocialProviderId, socialProviderCatalog } from "@getahoy/lib";
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
  return socialProviderCatalog.map((provider) => (
    <Button
      key={provider.id}
      variant="outline"
      disabled={pending}
      onPress={() => onSelect(provider.id)}
    >
      <Text aria-hidden className="font-mono text-callout">
        {provider.id.charAt(0).toUpperCase()}
      </Text>
      <Text>{provider.label}</Text>
    </Button>
  ));
}
