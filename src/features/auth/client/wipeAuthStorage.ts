import { storageAdapter } from "@better-auth/expo/client";
import { APP_SCHEME } from "@getahoy/lib";
import * as SecureStore from "expo-secure-store";

const EMPTY_ENTRY = "{}";

// The Keychain outlives an iOS uninstall; the library's own wrapper also
// clears the chunk keys a long cookie was split across.
export async function wipeAuthStorage(): Promise<void> {
  const storage = storageAdapter(SecureStore);
  await storage.setItemAsync(`${APP_SCHEME}_cookie`, EMPTY_ENTRY);
  await storage.setItemAsync(`${APP_SCHEME}_session_data`, EMPTY_ENTRY);
}
