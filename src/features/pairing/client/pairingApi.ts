import { pairingCalls } from "@getahoy/lib";
import { sessionClient } from "@/features/auth/client/sessionClient";

export const pairingApi = pairingCalls(sessionClient.call);
