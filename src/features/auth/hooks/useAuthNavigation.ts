import { useRouter } from "expo-router";

export function useAuthNavigation() {
  const router = useRouter();

  return {
    goToAccount: () => router.replace("/account"),
    goToSignIn: () => router.replace("/sign-in"),
  };
}
