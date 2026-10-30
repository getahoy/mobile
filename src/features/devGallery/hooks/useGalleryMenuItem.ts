import { router } from "expo-router";
import { useEffect } from "react";
import { galleryCopy } from "../copy/galleryCopy";

export function useGalleryMenuItem(): void {
  useEffect(() => {
    if (!__DEV__) return;
    const devMenu: typeof import("expo-dev-menu") = require("expo-dev-menu");
    const openGallery = () => router.push("/dev/components");
    void devMenu
      .registerDevMenuItems([
        {
          name: galleryCopy.menuItem,
          callback: openGallery,
          shouldCollapse: true,
        },
      ])
      .catch(() => undefined);
  }, []);
}
