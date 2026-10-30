import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { galleryCopy } from "../copy/galleryCopy";
import { GallerySection } from "./gallerySection";

const revealLabels = {
  show: galleryCopy.showPassword,
  hide: galleryCopy.hidePassword,
};

export function InputsSection() {
  return (
    <GallerySection title={galleryCopy.inputs}>
      <Input
        placeholder={galleryCopy.emailPlaceholder}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input shape="field" placeholder={galleryCopy.emailPlaceholder} />
      <Input defaultValue={galleryCopy.password} secure={revealLabels} />
      <Input invalid defaultValue={galleryCopy.emailPlaceholder} />
      <Text variant="footnote" className="pl-1 text-flare">
        {galleryCopy.invalid}
      </Text>
      <Input editable={false} defaultValue={galleryCopy.emailPlaceholder} />
    </GallerySection>
  );
}
