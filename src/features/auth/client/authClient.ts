import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import { publicEnv } from "@/env/publicEnv";

const APP_SCHEME = "ahoy";

export const authClient = createAuthClient({
  baseURL: publicEnv.EXPO_PUBLIC_API_URL,
  plugins: [
    expoClient({
      scheme: APP_SCHEME,
      storagePrefix: APP_SCHEME,
      storage: SecureStore,
    }),
  ],
});
