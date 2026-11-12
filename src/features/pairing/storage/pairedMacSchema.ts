import {
  bytes32Schema,
  endReasonSchema,
  localHostSchema,
} from "@getahoy/protocol";
import { z } from "zod";

export const pairedMacSchema = z.object({
  publicKey: bytes32Schema,
  displayName: z.string(),
  lastKnownAddresses: z.array(z.string()),
  localHost: localHostSchema.nullable().default(null),
  lanPort: z.int().nullable(),
  pairedAt: z.int(),
  paused: z.boolean().default(false),
});

// Older builds kept an ended Mac in the list; settleEndedMacs migrates it.
export const storedMacSchema = pairedMacSchema.extend({
  ended: z
    .object({ reason: endReasonSchema, at: z.int() })
    .nullable()
    .default(null),
});

export type PairedMac = z.infer<typeof pairedMacSchema>;
export type StoredMac = z.infer<typeof storedMacSchema>;
