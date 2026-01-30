import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.string().transform(Number),
    ORIGIN_URL: z.string(),
    DATABASE_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    APP_PASS: z.string(),
    APP_USER: z.string(),
    APP_URL: z.string(),
  },

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
