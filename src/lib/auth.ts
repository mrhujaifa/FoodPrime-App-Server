import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "./env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [env.ORIGIN_URL],
  advanced: {
    cookiePrefix: "better-auth",
    crossSubDomainCookies: {
      enabled: true,
    },
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      path: "/",
    },
    cookies: {
      session_token: {
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        },
      },
    },
  },

  baseURL: env.BETTER_AUTH_URL,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

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
});
