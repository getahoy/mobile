import { AccountSummary } from "../components/accountSummary";
import { SignOutButton } from "../components/signOutButton";

type AccountScreenProps = {
  name: string;
  email: string;
};

export function AccountScreen({ name, email }: AccountScreenProps) {
  return (
    <>
      <AccountSummary name={name} email={email} />
      <SignOutButton />
    </>
  );
}
