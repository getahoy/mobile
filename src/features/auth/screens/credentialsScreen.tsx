import { type AuthResponse, useCredentialsForm } from "@getahoy/lib";
import { type Href, Link } from "expo-router";
import type { z } from "zod";
import { Text } from "@/components/ui/text";
import { AuthScreenLayout } from "../components/authScreenLayout";
import { CredentialsForm } from "../components/credentialsForm";
import { SocialSignInButtons } from "../components/socialSignInButtons";
import type { CredentialField } from "../forms/credentialFields";
import { useSocialSignIn } from "../hooks/useSocialSignIn";

type CredentialsScreenProps<Input extends Record<string, string>> = {
  title: string;
  submitLabel: string;
  fields: readonly CredentialField<keyof Input & string>[];
  schema: z.ZodType<Input>;
  request: (input: Input) => Promise<AuthResponse>;
  switchHref: Href;
  switchLabel: string;
};

export function CredentialsScreen<Input extends Record<string, string>>(
  props: CredentialsScreenProps<Input>,
) {
  const credentials = useCredentialsForm(props.schema, props.request);
  const social = useSocialSignIn();
  const pending = credentials.pending || social.pending;

  return (
    <AuthScreenLayout title={props.title}>
      <CredentialsForm
        fields={props.fields}
        values={credentials.values}
        submitLabel={props.submitLabel}
        pending={pending}
        errorMessage={credentials.errorMessage ?? social.errorMessage}
        onChange={credentials.setField}
        onSubmit={credentials.submit}
      />
      <SocialSignInButtons pending={pending} onSelect={social.signInWith} />
      <Link href={props.switchHref} replace>
        <Text className="text-primary text-sm">{props.switchLabel}</Text>
      </Link>
    </AuthScreenLayout>
  );
}
