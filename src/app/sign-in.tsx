import { Redirect } from "expo-router";
import { authClient } from "@/features/auth/client/authClient";
import { SessionLoading } from "@/features/auth/components/sessionLoading";
import { SignInScreen } from "@/features/auth/screens/signInScreen";

export default function SignInRoute() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return <SessionLoading />;
  if (session) return <Redirect href="/account" />;
  return <SignInScreen />;
}
