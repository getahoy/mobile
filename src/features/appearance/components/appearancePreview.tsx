import type { Appearance } from "@getahoy/lib";
import { View } from "react-native";
import { ScopedTheme } from "uniwind";
import { AppearanceTileFace } from "./appearanceTileFace";

type AppearancePreviewProps = { appearance: Appearance };

export function AppearancePreview({ appearance }: AppearancePreviewProps) {
  return (
    <View className="h-appearance-tile-y w-appearance-tile-x overflow-hidden rounded-tile">
      <ScopedTheme theme={appearance === "dark" ? "dark" : "light"}>
        <AppearanceTileFace />
      </ScopedTheme>
      {appearance === "system" ? (
        <View className="absolute inset-y-0 right-0 left-1/2 overflow-hidden">
          <View className="absolute inset-y-0 -left-10 w-appearance-tile-x">
            <ScopedTheme theme="dark">
              <AppearanceTileFace />
            </ScopedTheme>
          </View>
        </View>
      ) : null}
      <View className="absolute inset-0 rounded-tile border border-ink/10" />
    </View>
  );
}
