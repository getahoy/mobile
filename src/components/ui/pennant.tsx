import { Image } from "react-native";

const pennant = require("../../../assets/images/pennant.png");

export function Pennant() {
  return (
    <Image
      source={pennant}
      aria-hidden
      className="h-5.5 w-7.5"
      tintColorClassName="accent-ink"
    />
  );
}
