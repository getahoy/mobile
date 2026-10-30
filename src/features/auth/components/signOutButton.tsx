import { authCopy } from "@getahoy/lib";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSignOut } from "../hooks/useSignOut";
import { FormError } from "./formError";

export function SignOutButton() {
  const { pending, checking, errorMessage, signOut } = useSignOut();

  return (
    <View className="gap-2">
      <Button
        variant="secondary"
        disabled={pending || checking}
        onPress={signOut}
      >
        <Text>
          {pending ? authCopy["signOut.pending"] : authCopy["signOut.submit"]}
        </Text>
      </Button>
      <FormError message={errorMessage} />
    </View>
  );
}
