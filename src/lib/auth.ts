import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "./env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [env.ORIGIN_URL],

  baseURL: env.BETTER_AUTH_URL,

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER", // 'CUSTOMER' | 'PROVIDER' | 'ADMIN'
        input: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE", // 'ACTIVE' | 'SUSPENDED'
        input: false,
      },
      address: {
        type: "string",
        required: false,
      },
      providerName: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },

  // Session config for cookie caching
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes cache
    },
  },

  // Advanced cookie settings - fixes cross-origin cookie issue
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: true, // HTTPS required in production

    cookies: {
      session_token: {
        name: "better-auth.session_token",
        options: {
          httpOnly: true, // Prevent JS access
          sameSite: "none", // Allow cross-origin - CRITICAL for separate domains
          secure: true, // HTTPS only - CRITICAL for SameSite=none
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        },
      },
    },
  },
});
