import { historyCalls } from "@getahoy/lib";
import { sessionClient } from "@/features/auth/client/sessionClient";

export const historyApi = historyCalls(sessionClient.call);
