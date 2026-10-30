import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { galleryCopy } from "../copy/galleryCopy";
import { useTimedAction } from "../hooks/useTimedAction";
import { GallerySection } from "./gallerySection";

const QUICK_ACTION_MS = 200;
const SLOW_ACTION_MS = 1500;

const variants = [
  ["primary", galleryCopy.primary],
  ["secondary", galleryCopy.secondary],
  ["ghost", galleryCopy.ghost],
  ["destructive", galleryCopy.destructive],
] as const;

export function ButtonsSection() {
  const quick = useTimedAction(QUICK_ACTION_MS);
  const slow = useTimedAction(SLOW_ACTION_MS);
  return (
    <GallerySection title={galleryCopy.buttons}>
      {variants.map(([variant, label]) => (
        <View key={variant} className="flex-row items-center gap-3">
          <Button variant={variant} className="flex-1">
            <Text>{label}</Text>
          </Button>
          <Button variant={variant} size="sm">
            <Text>{label}</Text>
          </Button>
        </View>
      ))}
      <Button disabled>
        <Text>{galleryCopy.disabled}</Text>
      </Button>
      <Button variant="secondary" loading={quick.running} onPress={quick.run}>
        <Text>{galleryCopy.quickAction}</Text>
      </Button>
      <Button loading={slow.running} onPress={slow.run}>
        <Text>{galleryCopy.slowAction}</Text>
      </Button>
    </GallerySection>
  );
}
