import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { permissionCopy } from "../copy/permissionCopy";

type PermissionLayoutProps = {
  onClose: () => void;
  children: ReactNode;
};

export function PermissionLayout({ onClose, children }: PermissionLayoutProps) {
  return (
    <View className="flex-1 bg-sailcloth pt-safe">
      <View className="h-14 flex-row items-center px-2.5">
        <Pressable
          role="button"
          accessibilityLabel={permissionCopy.close}
          onPress={onClose}
          className="size-11 items-center justify-center rounded-full active:bg-linen"
        >
          <Icon name="close" />
        </Pressable>
      </View>
      {children}
    </View>
  );
}
