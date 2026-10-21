import { authCopy, useCredentialsSignIn } from "@getahoy/auth";
import { Link } from "expo-router";
import { Text } from "@/components/ui/text";
import { signInWithEmail } from "../client/authActions";
import { AuthScreenLayout } from "../components/authScreenLayout";
import { CredentialsForm } from "../components/credentialsForm";
import { signInFields } from "../forms/credentialFields";
import { useAuthNavigation } from "../hooks/useAuthNavigation";

export function SignInScreen() {
  const navigation = useAuthNavigation();
  const credentials = useCredentialsSignIn({
    signIn: signInWithEmail,
    onSuccess: navigation.goToAccount,
  });

  return (
    <AuthScreenLayout title={authCopy["signIn.title"]}>
      <CredentialsForm
        fields={signInFields}
        values={credentials.values}
        submitLabel={authCopy["signIn.submit"]}
        pending={credentials.pending}
        errorMessage={credentials.errorMessage}
        onChange={credentials.setField}
        onSubmit={credentials.submit}
      />
      <Link href="/sign-up" replace>
        <Text className="text-primary text-sm">
          {authCopy["signIn.switch"]}
        </Text>
      </Link>
    </AuthScreenLayout>
  );
}
