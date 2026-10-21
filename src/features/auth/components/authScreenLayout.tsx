import type { ReactNode } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";

type AuthScreenLayoutProps = {
  title: string;
  children: ReactNode;
};

export function AuthScreenLayout({ title, children }: AuthScreenLayoutProps) {
  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-background">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-grow justify-center gap-6 p-6"
      >
        <Text variant="h3">{title}</Text>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
