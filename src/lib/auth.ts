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
});
