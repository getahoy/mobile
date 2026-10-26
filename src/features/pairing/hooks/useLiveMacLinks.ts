import { createContext, useContext } from "react";
import type { LiveMacLinks } from "../connection/liveMacLinks";

export const LiveMacLinksContext = createContext<LiveMacLinks | null>(null);

export function useLiveMacLinks(): LiveMacLinks {
  const links = useContext(LiveMacLinksContext);
  if (!links) throw new Error("LiveMacLinksProvider is missing");
  return links;
}
