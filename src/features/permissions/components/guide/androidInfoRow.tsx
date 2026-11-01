import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { MockPress } from "./mockPress";

type AndroidInfoRowProps = {
  title: string;
  detail: string;
  pressed: boolean;
  divided: boolean;
};

export function AndroidInfoRow({
  title,
  detail,
  pressed,
  divided,
}: AndroidInfoRowProps) {
  return (
    <View
      className={cn(
        "h-10.5 justify-center px-3.5",
        divided && "border-t border-rope",
      )}
    >
      <MockPress pressed={pressed} />
      <Text variant="footnote">{title}</Text>
      <Text className="text-driftwood text-mock-caption">{detail}</Text>
    </View>
  );
}
