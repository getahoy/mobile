import { useEffect, useRef } from "react";
import { AccessibilityInfo } from "react-native";

export function useAnnounceChange(text: string) {
  const announced = useRef(text);
  useEffect(() => {
    if (text === announced.current) return;
    announced.current = text;
    AccessibilityInfo.announceForAccessibility(text);
  }, [text]);
}
