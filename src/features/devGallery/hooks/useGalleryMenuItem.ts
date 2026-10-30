import { registerDevMenuItems } from "expo-dev-menu";
import { router } from "expo-router";
import { useEffect } from "react";
import { galleryCopy } from "../copy/galleryCopy";

export function useGalleryMenuItem(): void {
  useEffect(() => {
    if (!__DEV__) return;
    const openGallery = () => router.push("/dev/components");
    void registerDevMenuItems([
      {
        name: galleryCopy.menuItem,
        callback: openGallery,
        shouldCollapse: true,
      },
    ]).catch(() => undefined);
  }, []);
}
