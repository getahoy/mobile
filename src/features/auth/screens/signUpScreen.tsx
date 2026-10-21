import { Link } from "expo-router";
import { Text } from "@/components/ui/text";
import { signUpWithEmail } from "../client/authActions";
import { AuthScreenLayout } from "../components/authScreenLayout";
import { CredentialsForm } from "../components/credentialsForm";
import { authCopy } from "../copy/authCopy";
import { signUpFields } from "../forms/credentialFields";
import { useAuthNavigation } from "../hooks/useAuthNavigation";
import { useCredentialsSignUp } from "../hooks/useCredentialsSignUp";

export function SignUpScreen() {
  const navigation = useAuthNavigation();
  const credentials = useCredentialsSignUp({
    signUp: signUpWithEmail,
    onSuccess: navigation.goToAccount,
  });

  return (
    <AuthScreenLayout title={authCopy["signUp.title"]}>
      <CredentialsForm
        fields={signUpFields}
        values={credentials.values}
        submitLabel={authCopy["signUp.submit"]}
        pending={credentials.pending}
        errorMessage={credentials.errorMessage}
        onChange={credentials.setField}
        onSubmit={credentials.submit}
      />
      <Link href="/sign-in" replace>
        <Text className="text-primary text-sm">
          {authCopy["signUp.switch"]}
        </Text>
      </Link>
    </AuthScreenLayout>
  );
}
