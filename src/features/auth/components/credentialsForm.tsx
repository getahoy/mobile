import { authCopy } from "@getahoy/lib";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import type { CredentialField } from "../forms/credentialFields";
import { FormError } from "./formError";

type CredentialsFormProps<Name extends string> = {
  fields: readonly CredentialField<Name>[];
  values: Partial<Record<Name, string>>;
  submitLabel: string;
  pending: boolean;
  errorMessage: string | null;
  onChange: (name: Name, text: string) => void;
  onSubmit: () => void;
};

export function CredentialsForm<Name extends string>({
  fields,
  values,
  submitLabel,
  pending,
  errorMessage,
  onChange,
  onSubmit,
}: CredentialsFormProps<Name>) {
  return (
    <View className="gap-4">
      {fields.map((field) => (
        <View key={field.name} className="gap-2">
          <Label nativeID={field.name}>{field.label}</Label>
          <Input
            aria-labelledby={field.name}
            value={values[field.name] ?? ""}
            onChangeText={(text) => onChange(field.name, text)}
            autoComplete={field.autoComplete}
            textContentType={field.textContentType}
            keyboardType={field.keyboardType}
            secureTextEntry={field.secureTextEntry}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            editable={!pending}
          />
        </View>
      ))}
      <FormError message={errorMessage} />
      <Button disabled={pending} onPress={onSubmit}>
        <Text>{pending ? authCopy["form.pending"] : submitLabel}</Text>
      </Button>
    </View>
  );
}
