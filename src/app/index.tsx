import { authClient } from "@/features/auth/client/authClient";
import { AuthScreenLayout } from "@/features/auth/components/authScreenLayout";
import { authCopy } from "@/features/auth/copy/authCopy";
import { AccountScreen } from "@/features/auth/screens/accountScreen";

export default function AccountRoute() {
  const { data: session } = authClient.useSession();
  if (!session) return null;

  return (
    <AuthScreenLayout title={authCopy["account.title"]}>
      <AccountScreen name={session.user.name} email={session.user.email} />
    </AuthScreenLayout>
  );
}
