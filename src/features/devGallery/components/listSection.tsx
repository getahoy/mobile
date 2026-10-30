import { useState } from "react";
import { ListGroup } from "@/components/ui/listGroup";
import { ListRow } from "@/components/ui/listRow";
import { StatusPill } from "@/components/ui/statusPill";
import { Switch } from "@/components/ui/switch";
import { galleryCopy } from "../copy/galleryCopy";
import { GallerySection } from "./gallerySection";

export function ListSection() {
  const [silent, setSilent] = useState(false);
  const noop = () => undefined;
  return (
    <GallerySection title={galleryCopy.list}>
      <ListGroup header={galleryCopy.macsHeader}>
        <ListRow
          label={galleryCopy.macName}
          tone="strong"
          accessory={
            <StatusPill tone="connected" label={galleryCopy.connected} />
          }
        />
        <ListRow label={galleryCopy.addAnother} onPress={noop} />
        <ListRow label={galleryCopy.remove} tone="destructive" onPress={noop} />
      </ListGroup>
      <ListGroup header={galleryCopy.playsOn} footer={galleryCopy.voiceFooter}>
        <ListRow
          label={galleryCopy.playsOn}
          value={galleryCopy.playsOnValue}
          onPress={noop}
        />
        <ListRow label={galleryCopy.disabledRow} disabled onPress={noop} />
        <ListRow
          label={galleryCopy.silentMode}
          accessory={
            <Switch
              checked={silent}
              onCheckedChange={setSilent}
              accessibilityLabel={galleryCopy.silentMode}
            />
          }
        />
      </ListGroup>
    </GallerySection>
  );
}
