import type { ReactNode } from "react";
import { TalkPanel } from "@/features/talk/components/talkPanel";
import { talkBlockOf } from "@/features/talk/talkBlock";
import { useMacLink } from "../hooks/useMacLink";
import type { PairedMac } from "../storage/pairedMacs";
import { HomeMac } from "./homeMac";

type MacHomeProps = {
  mac: PairedMac;
  macs: readonly PairedMac[];
  onChanged: () => void;
  notice: ReactNode;
};

// The chip and the talk bar read one steady link state, so they never disagree.
export function MacHome({ mac, macs, onChanged, notice }: MacHomeProps) {
  const link = useMacLink(mac);
  return (
    <>
      <HomeMac mac={mac} macs={macs} link={link} onChanged={onChanged} />
      <TalkPanel mac={mac} block={talkBlockOf(link.state)} notice={notice} />
    </>
  );
}
