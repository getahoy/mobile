import { View } from "react-native";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import type { CredentialField } from "../forms/credentialFields";
import { FormError } from "./formError";

type CredentialsFormProps<Name extends string> = {
  fields: readonly CredentialField<Name>[];
  values: Partial<Record<Name, string>>;
  pending: boolean;
  errorMessage: string | null;
  onChange: (name: Name, text: string) => void;
  onSubmit: () => void;
};

export function CredentialsForm<Name extends string>({
  fields,
  values,
  pending,
  errorMessage,
  onChange,
  onSubmit,
}: CredentialsFormProps<Name>) {
  const lastField = fields[fields.length - 1]?.name;
  return (
    <View className="gap-3.5">
      {fields.map((field) => (
        <View key={field.name} className="gap-1.5">
          <Text
            nativeID={field.name}
            className="pl-1 font-sans text-body-sm text-driftwood"
          >
            {field.label}
          </Text>
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
            invalid={errorMessage !== null}
            editable={!pending}
            returnKeyType={field.name === lastField ? "go" : "next"}
            {...(field.name === lastField ? { onSubmitEditing: onSubmit } : {})}
          />
        </View>
      ))}
      <FormError message={errorMessage} />
    </View>
  );
}
