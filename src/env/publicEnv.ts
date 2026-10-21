import { z } from "zod";

const publicEnvSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
});

export const publicEnv = publicEnvSchema.parse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
});
