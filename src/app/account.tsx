import { authCopy } from "@/features/auth/copy/authCopy";
import { Redirect } from "expo-router";
import { authClient } from "@/features/auth/client/authClient";
import { AuthScreenLayout } from "@/features/auth/components/authScreenLayout";
import { SessionLoading } from "@/features/auth/components/sessionLoading";
import { AccountScreen } from "@/features/auth/screens/accountScreen";

export default function AccountRoute() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return <SessionLoading />;
  if (!session) return <Redirect href="/sign-in" />;
  return (
    <AuthScreenLayout title={authCopy["account.title"]}>
      <AccountScreen name={session.user.name} email={session.user.email} />
    </AuthScreenLayout>
  );
}
