import { View } from "react-native";

export function AppearanceTileFace() {
  return (
    <View className="absolute inset-0 bg-sailcloth">
      <View className="absolute top-2.5 left-2.25 h-2.25 w-9 rounded-full bg-paper" />
      <View className="absolute top-11 right-3.25 left-3.25 h-1.25 rounded-full bg-ink opacity-70" />
      <View className="absolute top-13.5 right-5.5 left-5.5 h-1.25 rounded-full bg-ink opacity-30" />
      <View className="absolute right-1.75 bottom-2.25 left-1.75 h-4 rounded-full bg-ink">
        <View className="absolute top-0.5 left-0.5 size-3 rounded-full bg-sailcloth" />
      </View>
    </View>
  );
}
