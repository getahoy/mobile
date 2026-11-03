import "@/features/pairing/crypto/randomValues";
import "@/global.css";

import { SessionRoot } from "@/features/auth/components/sessionRoot";
import { useInstallWipe } from "@/features/auth/hooks/useInstallWipe";
import type * as GalleryMenu from "@/features/devGallery/hooks/useGalleryMenuItem";

export { ErrorFallback as ErrorBoundary } from "@/features/errors/components/errorFallback";

// Metro drops the false branch from release bundles, so no gallery code ships.
const devMenu: typeof GalleryMenu | null = __DEV__
  ? require("@/features/devGallery/hooks/useGalleryMenuItem")
  : null;
const useGalleryMenuItem = devMenu?.useGalleryMenuItem ?? (() => undefined);

// The session must not load before a reinstall wipe settles, or the stale
// Keychain session would open Home; the splash stays up meanwhile.
export default function RootLayout() {
  const installChecked = useInstallWipe();
  useGalleryMenuItem();
  return installChecked ? <SessionRoot /> : null;
}
