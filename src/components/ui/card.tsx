import type { ComponentProps } from "react";
import { View } from "react-native";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentProps<typeof View>) {
  return (
    <View className={cn("rounded-card bg-paper p-5", className)} {...props} />
  );
}
