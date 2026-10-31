import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";
import type { VoiceActivity } from "../voiceActivity";
import { VoiceDots } from "./voiceDots";

type TalkBarContentProps = {
  label: string;
  labelStyle: "text" | "timer";
  disabled: boolean;
  activity: VoiceActivity;
};

export function TalkBarContent(props: TalkBarContentProps) {
  const { label, labelStyle, disabled, activity } = props;
  return (
    <>
      <View
        className={cn(
          "size-11 items-center justify-center rounded-full bg-paper",
          disabled && "opacity-40",
        )}
      >
        {activity.dots === "off" ? (
          <Icon name="mic" />
        ) : (
          <VoiceDots mode={activity.dots} level={activity.level} />
        )}
      </View>
      <Text
        numberOfLines={1}
        className={cn(
          "flex-1",
          labelStyle === "timer"
            ? "font-mono text-callout tabular-nums"
            : "font-sans-medium text-body-sm",
          activity.orb ? "text-on-ink" : "text-fog",
        )}
      >
        {label}
      </Text>
    </>
  );
}
