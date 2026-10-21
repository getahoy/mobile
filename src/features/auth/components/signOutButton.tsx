import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { signOut } from "../client/authActions";
import { authCopy } from "../copy/authCopy";
import { useAuthNavigation } from "../hooks/useAuthNavigation";
import { useSignOut } from "../hooks/useSignOut";
import { FormError } from "./formError";

export function SignOutButton() {
  const navigation = useAuthNavigation();
  const { pending, errorMessage, submit } = useSignOut({
    signOut,
    onSuccess: navigation.goToSignIn,
  });

  return (
    <View className="gap-2">
      <Button variant="outline" disabled={pending} onPress={submit}>
        <Text>
          {pending ? authCopy["signOut.pending"] : authCopy["signOut.submit"]}
        </Text>
      </Button>
      <FormError message={errorMessage} />
    </View>
  );
}
