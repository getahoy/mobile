import { authCopy } from "@getahoy/lib";
import { ConfirmSheet } from "@/components/ui/confirmSheet";
import { ListGroup } from "@/components/ui/listGroup";
import { ListRow } from "@/components/ui/listRow";
import { useSignOut } from "../hooks/useSignOut";
import { FormError } from "./formError";

export function SignOutRow() {
  const { pending, checking, errorMessage, signOut, request } = useSignOut();
  const label = pending
    ? authCopy["signOut.pending"]
    : authCopy["signOut.submit"];
  return (
    <>
      <ListGroup>
        <ListRow
          label={label}
          tone="destructive"
          disabled={pending || checking}
          onPress={signOut}
        />
      </ListGroup>
      <FormError message={errorMessage} />
      <ConfirmSheet request={request} />
    </>
  );
}
