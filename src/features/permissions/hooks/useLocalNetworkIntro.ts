import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { permissionPlatform } from "../platform/permissionPlatform";
import { useLocalNetworkIntroSeen } from "../storage/localNetworkMemory";

// iOS shows its Local Network popup on the first LAN dial, so dialing waits
// until our explainer has run.
export function useLocalNetworkIntro(hasMacs: boolean): boolean {
  const { seen } = useLocalNetworkIntroSeen();
  const pending = permissionPlatform.asksForLocalNetwork && !seen;

  useFocusEffect(
    useCallback(() => {
      if (pending && hasMacs) router.push("/local-network");
    }, [pending, hasMacs]),
  );

  return pending;
}
