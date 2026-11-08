import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Cached pages belong to the account that fetched them; the next account starts empty.
export function useClearCacheOnSignOut(signedIn: boolean) {
  const client = useQueryClient();
  useEffect(() => {
    if (!signedIn) client.clear();
  }, [client, signedIn]);
}
