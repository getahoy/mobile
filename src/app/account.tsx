import { authClient } from "@/features/auth/client/authClient";
import { SettingsScreen } from "@/features/settings/screens/settingsScreen";

export default function SettingsRoute() {
  const { data: session } = authClient.useSession();
  if (!session) return null;
  return <SettingsScreen name={session.user.name} email={session.user.email} />;
}
