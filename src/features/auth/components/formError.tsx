import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";

type FormErrorProps = { message: string | null; className?: string };

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;
  return (
    <Text
      role="alert"
      accessibilityLiveRegion="polite"
      className={cn("px-1 font-sans text-body-sm text-flare", className)}
    >
      {message}
    </Text>
  );
}
