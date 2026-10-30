import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";
import { Text } from "./text";

type ListRowProps = {
  label: string;
  value?: string;
  tone?: "plain" | "strong" | "destructive";
  accessory?: ReactNode;
  disabled?: boolean;
  onPress?: () => void;
};

const labelTones = {
  plain: "",
  strong: "font-sans-medium",
  destructive: "text-flare",
} as const;

export function ListRow({
  label,
  value,
  tone = "plain",
  accessory,
  disabled = false,
  onPress,
}: ListRowProps) {
  const opensSomething = onPress !== undefined && tone !== "destructive";
  const content = (
    <>
      <Text numberOfLines={1} className={cn("flex-1", labelTones[tone])}>
        {label}
      </Text>
      {value ? (
        <Text
          variant="bodySmall"
          numberOfLines={1}
          className="shrink text-driftwood"
        >
          {value}
        </Text>
      ) : null}
      {accessory}
      {opensSomething ? (
        <Icon name="chevronRight" size="sm" tintColorClassName="accent-fog" />
      ) : null}
    </>
  );
  const row = cn(
    "min-h-14 flex-row items-center gap-3 bg-paper pr-4 pl-5",
    disabled && "opacity-40",
  );
  if (!onPress) return <View className={row}>{content}</View>;
  return (
    <Pressable
      role="button"
      disabled={disabled}
      accessibilityState={{ disabled }}
      onPress={onPress}
      className={cn(row, "active:bg-sailcloth")}
    >
      {content}
    </Pressable>
  );
}
