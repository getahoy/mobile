import type { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "./text";

type ListGroupProps = {
  header?: string;
  footer?: string;
  children: ReactNode;
};

export function ListGroup({ header, footer, children }: ListGroupProps) {
  return (
    <View className="gap-2">
      {header ? (
        <Text variant="eyebrow" role="heading" className="pl-1">
          {header}
        </Text>
      ) : null}
      <View className="gap-px overflow-hidden rounded-card bg-rope">
        {children}
      </View>
      {footer ? (
        <Text variant="footnote" className="px-1 pt-0.5 text-driftwood">
          {footer}
        </Text>
      ) : null}
    </View>
  );
}
