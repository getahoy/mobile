import { TurnedOnPill } from "@/features/permissions/components/turnedOnPill";
import { useTurnedOnNotice } from "@/features/permissions/hooks/useTurnedOnNotice";
import { useEndedNotice } from "../storage/endedNotice";
import { EndedNote } from "./endedNote";

type HomeNoticesProps = { macName: string };

export function HomeNotices({ macName }: HomeNoticesProps) {
  const turnedOn = useTurnedOnNotice();
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
