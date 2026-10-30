import type { CommandChoice } from "@getahoy/protocol";
import { useEffect, useRef, useState } from "react";
import { haptics } from "@/lib/haptics";
import { choiceSheetStep } from "../choiceSheetStep";
import type { TalkState } from "../talkState";

type ShownChoices = {
  choices: readonly CommandChoice[];
  message: string;
  confirm: boolean;
};

export function useChoiceSheet(
  state: TalkState,
  onChoose: (number: number) => void,
  onDismiss: () => void,
) {
  const [shown, setShown] = useState<ShownChoices | null>(null);
  const [expired, setExpired] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const leaving = useRef(false);
  const open = useRef(false);
  const previous = useRef(state.kind);

  useEffect(() => {
    const step = choiceSheetStep(previous.current, state, leaving.current);
    previous.current = state.kind;
    if (step === "show" && state.kind === "answered") {
      const { choices, message, confirm } = state;
      setShown({ choices, message, confirm });
      setExpired(false);
      setPicked(null);
      leaving.current = false;
      open.current = true;
      if (confirm) haptics.confirmOpen();
      return;
    }
    if (!open.current || step === "keep") return;
    if (step === "expire") return setExpired(true);
    open.current = false;
    setShown(null);
  }, [state]);

  const choose = (number: number) => {
    if (expired) return;
    haptics.choicePicked();
    setPicked(number);
    leaving.current = true;
    onChoose(number);
  };
  const dismiss = () => {
    leaving.current = true;
    open.current = false;
    setShown(null);
    if (!expired) onDismiss();
  };
  return { shown, expired, picked, choose, dismiss };
}
