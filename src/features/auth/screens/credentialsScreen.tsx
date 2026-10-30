import {
  type AuthResponse,
  type SocialProviderId,
  useAuthRequest,
  useCredentialsForm,
} from "@getahoy/lib";
import { type Href, Link } from "expo-router";
import { View } from "react-native";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { AuthScreenLayout } from "../components/authScreenLayout";
import { CredentialsForm } from "../components/credentialsForm";
import { FormError } from "../components/formError";
import { SigningIn } from "../components/signingIn";
import { SocialSignInButtons } from "../components/socialSignInButtons";
import type { CredentialField } from "../forms/credentialFields";
import { useSigningInOverlay } from "../hooks/useSigningInOverlay";
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
  const authRequest = useAuthRequest();
  const credentials = useCredentialsForm({
    schema: props.schema,
    request: props.request,
    authRequest,
  });
  const social = useSocialSignIn(authRequest);
  const overlay = useSigningInOverlay(authRequest);
  const { pending, errorMessage } = authRequest;
  const fromGoogle = overlay.source === "google";
  const submit = () => {
    overlay.track("credentials");
    credentials.submit();
  };
  const signInWith = (provider: SocialProviderId) => {
    overlay.track("google");
    social.signInWith(provider);
  };
  const footer = (
    <Link href={props.switchHref} replace asChild>
      <Button variant="ghost" size="sm" className="self-center px-3">
        <Text className="text-signal">{props.switchLabel}</Text>
      </Button>
    </Link>
  );
  return (
    <View className="flex-1">
      <AuthScreenLayout title={props.title} footer={footer}>
        <CredentialsForm
          fields={props.fields}
          values={credentials.values}
          pending={pending}
          errorMessage={fromGoogle ? null : errorMessage}
          onChange={credentials.setField}
          onSubmit={submit}
        />
        <View className="gap-2.5">
          <Button
            loading={pending && !fromGoogle}
            disabled={pending}
            onPress={submit}
          >
            <Text>{props.submitLabel}</Text>
          </Button>
          <SocialSignInButtons pending={pending} onSelect={signInWith} />
          <FormError
            message={fromGoogle ? errorMessage : null}
            className="pt-1 text-center"
          />
        </View>
      </AuthScreenLayout>
      {overlay.visible ? (
        <SigningIn slow={overlay.slow} onCancel={overlay.cancel} />
      ) : null}
    </View>
  );
}
