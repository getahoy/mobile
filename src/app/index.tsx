import { Redirect } from "expo-router";
import { authClient } from "@/features/auth/client/authClient";
import { SessionLoading } from "@/features/auth/components/sessionLoading";

export default function Index() {
  const { data: session, isPending } = authClient.useSession();
  if (isPending) return <SessionLoading />;
  return <Redirect href={session ? "/account" : "/sign-in"} />;
}
