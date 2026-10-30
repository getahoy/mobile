import { authCopy } from "@getahoy/lib";
import { ListGroup } from "@/components/ui/listGroup";
import { ListRow } from "@/components/ui/listRow";

type AccountGroupProps = { name: string; email: string };

export function AccountGroup({ name, email }: AccountGroupProps) {
  return (
    <ListGroup header={authCopy["account.title"]}>
      <ListRow label={authCopy["field.name"]} value={name} />
      <ListRow label={authCopy["field.email"]} value={email} />
    </ListGroup>
  );
}
