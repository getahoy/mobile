import { type ReactNode, useState } from "react";
import { LiveMacLinks } from "../connection/liveMacLinks";
import { LiveMacLinksContext } from "../hooks/useLiveMacLinks";

type LiveMacLinksProviderProps = { children: ReactNode };

export function LiveMacLinksProvider({ children }: LiveMacLinksProviderProps) {
  const [links] = useState(() => new LiveMacLinks());
  return (
    <LiveMacLinksContext.Provider value={links}>
      {children}
    </LiveMacLinksContext.Provider>
  );
}
