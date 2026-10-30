import type { CommandChoice } from "@getahoy/protocol";
import { useEffect, useRef, useState } from "react";
import { haptics } from "@/lib/haptics";
import type { TalkState } from "../talkState";

export type ShownChoices = {
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

  useEffect(() => {
    if (state.kind === "answered" && state.choices.length > 0) {
      const { choices, message, confirm } = state;
      setShown({ choices, message, confirm });
      setExpired(false);
      setPicked(null);
      leaving.current = false;
      open.current = true;
      if (confirm) haptics.confirmOpen();
      return;
    }
    if (!open.current) return;
    if (state.kind === "ready" && !leaving.current) {
      setExpired(true);
      return;
    }
    open.current = false;
    setShown(null);
  }, [state]);

  const close = () => {
    leaving.current = true;
    open.current = false;
    setShown(null);
  };
  const choose = (number: number) => {
    if (expired) return;
    haptics.choicePicked();
    setPicked(number);
    leaving.current = true;
    onChoose(number);
  };
  const dismiss = () => {
    close();
    if (!expired) onDismiss();
  };
  return { shown, expired, picked, choose, dismiss };
}
