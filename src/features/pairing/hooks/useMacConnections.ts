import { createContext, useContext } from "react";
import type { MacConnections } from "../connection/macConnections";

export const MacConnectionsContext = createContext<MacConnections | null>(null);

export function useMacConnections(): MacConnections {
  const connections = useContext(MacConnectionsContext);
  if (!connections) throw new Error("LiveMacLinksProvider is missing");
  return connections;
}
