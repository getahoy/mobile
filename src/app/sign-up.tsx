import { Redirect } from "expo-router";
import { authClient } from "@/features/auth/client/authClient";
import { SessionLoading } from "@/features/auth/components/sessionLoading";
import { SignUpScreen } from "@/features/auth/screens/signUpScreen";

export default function SignUpRoute() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return <SessionLoading />;
  if (session) return <Redirect href="/account" />;
  return <SignUpScreen />;
}
