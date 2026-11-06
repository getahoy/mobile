import { Image } from "react-native";
import { cn } from "@/lib/cn";

const pennant = require("../../../assets/images/pennant.png");

const sizes = { md: "h-5.5 w-7.5", sm: "h-3 w-3.75" } as const;

type PennantProps = { size?: keyof typeof sizes };

export function Pennant({ size = "md" }: PennantProps) {
  return (
    <Image
      source={pennant}
      aria-hidden
      className={cn(sizes[size])}
      tintColorClassName="accent-ink"
    />
  );
}
