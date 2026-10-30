import type { ReactNode } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { Pennant } from "@/components/ui/pennant";
import { Text } from "@/components/ui/text";

type AuthScreenLayoutProps = {
  title: string;
  footer?: ReactNode;
  children: ReactNode;
};

export function AuthScreenLayout({
  title,
  footer,
  children,
}: AuthScreenLayoutProps) {
  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-sailcloth">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-grow gap-7 px-5 pt-safe-offset-14 pb-10.5"
      >
        <View className="gap-2.5 px-1">
          <Pennant />
          <Text variant="heading">{title}</Text>
        </View>
        {children}
        <View className="flex-1" />
        {footer}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
