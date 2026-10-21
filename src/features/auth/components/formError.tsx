import { Text } from "@/components/ui/text";

type FormErrorProps = {
  message: string | null;
};

export function FormError({ message }: FormErrorProps) {
  return (
    <Text
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className="min-h-5 text-destructive text-sm"
    >
      {message}
    </Text>
  );
}
