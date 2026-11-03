import type { ReactNode } from "react";
import { View } from "react-native";
import { cn } from "@/lib/cn";

export type CarouselItemProps = {
  label: string;
  className?: string;
  children: ReactNode;
};

export function CarouselItem({ className, children }: CarouselItemProps) {
  return <View className={cn("flex-1", className)}>{children}</View>;
}
