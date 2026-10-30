import type * as GalleryModule from "@/features/devGallery/screens/galleryScreen";

// Metro drops the false branch from release bundles, so the gallery never ships.
const gallery: typeof GalleryModule | null = __DEV__
  ? require("@/features/devGallery/screens/galleryScreen")
  : null;

export default function DevComponentsRoute() {
  if (!gallery) return null;
  return <gallery.GalleryScreen />;
}
