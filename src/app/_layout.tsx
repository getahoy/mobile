import "@/features/welcome/launchTiming";
import "@/features/pairing/crypto/randomValues";
import "@/global.css";
import "@/features/appearance/applyStoredAppearance";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SessionRoot } from "@/features/auth/components/sessionRoot";
import { useInstallWipe } from "@/features/auth/hooks/useInstallWipe";
import type * as GalleryMenu from "@/features/devGallery/hooks/useGalleryMenuItem";

export { ErrorFallback as ErrorBoundary } from "@/features/errors/components/errorFallback";

// In memory only; the History saved copy is written by its own query.
// One retry, not three with backoff: an offline phone should say so fast.
const QUERY_DEFAULTS = { queries: { retry: 1 } };

// Metro drops the false branch from release bundles, so no gallery code ships.
const devMenu: typeof GalleryMenu | null = __DEV__
  ? require("@/features/devGallery/hooks/useGalleryMenuItem")
  : null;
const useGalleryMenuItem = devMenu?.useGalleryMenuItem ?? (() => undefined);

// The session must not load before a reinstall wipe settles, or the stale
// Keychain session would open Home; the splash stays up meanwhile.
export default function RootLayout() {
  const installChecked = useInstallWipe();
  const [client] = useState(
    () => new QueryClient({ defaultOptions: QUERY_DEFAULTS }),
  );
  useGalleryMenuItem();
  if (!installChecked) return null;
  return (
    <QueryClientProvider client={client}>
      <SessionRoot />
    </QueryClientProvider>
  );
}
