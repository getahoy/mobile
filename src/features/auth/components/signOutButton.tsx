import { authCopy } from "@getahoy/lib";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSignOut } from "../hooks/useSignOut";
import { FormError } from "./formError";

export function SignOutButton() {
  const { pending, errorMessage, signOut } = useSignOut();

  return (
    <View className="gap-2">
      <Button variant="outline" disabled={pending} onPress={signOut}>
        <Text>
          {pending ? authCopy["signOut.pending"] : authCopy["signOut.submit"]}
        </Text>
      </Button>
      <FormError message={errorMessage} />
    </View>
  );
}
