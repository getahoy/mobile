import { TurnedOnPill } from "@/features/permissions/components/turnedOnPill";
import type { TurnedOnNotice } from "@/features/permissions/hooks/useTurnedOnNotice";
import { useEndedNotice } from "../storage/endedNotice";
import { EndedNote } from "./endedNote";

type HomeNoticesProps = { macName: string; turnedOn: TurnedOnNotice };

export function HomeNotices({ macName, turnedOn }: HomeNoticesProps) {
  const ended = useEndedNotice();
  return (
    <>
      {turnedOn.notice ? (
        <TurnedOnPill
          key={turnedOn.notice.key}
          kind={turnedOn.notice.kind}
          look="home"
          onHidden={turnedOn.clear}
        />
      ) : null}
      {ended.notice ? (
        <EndedNote
          notice={ended.notice}
          stillPairedWith={macName}
          onDismiss={ended.dismiss}
        />
      ) : null}
    </>
  );
}
