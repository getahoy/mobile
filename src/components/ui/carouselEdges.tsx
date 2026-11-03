import { View } from "react-native";

export function CarouselEdges() {
  return (
    <>
      <View
        pointerEvents="none"
        className="absolute inset-y-0 left-0 w-edge-fade bg-linear-to-r from-sailcloth to-sailcloth/0"
      />
      <View
        pointerEvents="none"
        className="absolute inset-y-0 right-0 w-edge-fade bg-linear-to-l from-sailcloth to-sailcloth/0"
      />
    </>
  );
}
