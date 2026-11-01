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
      {activity.dots === "off" ? (
        <Icon
          name="mic"
          size="lg"
          tintColorClassName={disabled ? "accent-fog" : "accent-on-ink"}
        />
      ) : (
        <VoiceDots mode={activity.dots} level={activity.level} />
      )}
      <Text
        numberOfLines={1}
        className={cn(
          "shrink",
          labelStyle === "timer"
            ? "font-mono text-callout tabular-nums"
            : "font-sans-medium text-body",
          disabled ? "text-fog" : "text-on-ink",
        )}
      >
        {label}
      </Text>
    </>
  );
}
