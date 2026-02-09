var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express6 from "express";
import cors from "cors";

// src/lib/env.ts
import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
var env = createEnv({
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
    APP_URL: z.string()
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  role          String?   @default("CUSTOMER")\n  phone         String?\n  status        String?   @default("ACTIVE")\n  address       String?\n  providerName  String?\n  sessions      Session[]\n  accounts      Account[]\n\n  providerProfile ProviderProfile?\n  orders          Order[]\n  rivew           Review[]\n  cart            Cart[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Cart {\n  id         String     @id @default(uuid())\n  customerId String     @unique // Ekjon user-er ektai active cart thakbe\n  customer   User       @relation(fields: [customerId], references: [id])\n  items      CartItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CartItem {\n  id     String @id @default(uuid())\n  cartId String\n  cart   Cart   @relation(fields: [cartId], references: [id], onDelete: Cascade)\n\n  mealId String\n  meal   Meal   @relation(fields: [mealId], references: [id])\n\n  quantity Int @default(1)\n  // Ekhane price rakhar dorkar nai, karon cart shob shomoy current meal price dekhabe\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([cartId, mealId]) // Ek-i cart-e ek-i meal duibar thakbe na, quantity barhbe\n}\n\nmodel Category {\n  id    String  @id @default(ulid())\n  name  String  @unique\n  image String?\n  meals Meal[]\n}\n\nmodel Meal {\n  id            String   @id @default(uuid())\n  name          String\n  description   String\n  price         Decimal  @db.Decimal(10, 2)\n  discountPrice Decimal? @db.Decimal(10, 2)\n  imageUrl      String?\n  isAvailable   Boolean  @default(true)\n  isVeg         Boolean  @default(false)\n  spiciness     Spicy?   @default(MEDIUM)\n  isBestseller  Boolean  @default(false)\n  prepTime      Int?\n  calories      Int?\n  categoryId    String\n\n  category   Category        @relation(fields: [categoryId], references: [id])\n  orderItems OrderItem[]\n  rivew      Review[]\n  cart       CartItem[]\n  providerId String\n  provider   ProviderProfile @relation(fields: [providerId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nenum Spicy {\n  NONE\n  MILD\n  MEDIUM\n  HOT\n  EXTRA_HOT\n}\n\nmodel Order {\n  id               String        @id @default(uuid())\n  name             String\n  email            String\n  orderNumber      String        @unique\n  totalPrice       Decimal       @db.Decimal(10, 2)\n  deliveryAddress  String\n  phoneNumber      String\n  status           OrderStatus   @default(PLACED)\n  paymentMethod    PaymentType   @default(COD)\n  paymentStatus    PaymentStatus @default(PENDING)\n  estimatedArrival DateTime?\n  orderNotes       String?\n  customerId       String\n\n  customer User        @relation(fields: [customerId], references: [id])\n  items    OrderItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nenum OrderStatus {\n  PLACED\n  REJECTED\n  PREPARING\n  READY\n  ON_THE_WAY\n  DELIVERED\n  CANCELLED\n}\n\nenum PaymentType {\n  COD\n  ONLINE\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n}\n\nmodel OrderItem {\n  id      String @id @default(uuid())\n  orderId String\n  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  mealId String\n  meal   Meal   @relation(fields: [mealId], references: [id])\n\n  quantity Int\n  price    Decimal @db.Decimal(10, 2)\n}\n\nmodel ProviderProfile {\n  id                    String       @id @default(uuid())\n  userId                String       @unique\n  businessName          String\n  username              String       @default("temporary_user")\n  description           String?\n  address               String\n  logoUrl               String?\n  coverUrl              String?\n  isOpen                Boolean      @default(true)\n  isVerified            Boolean      @default(false)\n  rating                Float?       @default(0.0)\n  totalReviews          Int          @default(0)\n  cuisineType           CuisineType? @default(OTHERS)\n  deliveryFee           Decimal      @default(0.00) @db.Decimal(10, 2)\n  estimatedDeliveryTime String?\n\n  user  User   @relation(fields: [userId], references: [id]) // user relation\n  meals Meal[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @default(now())\n}\n\nenum CuisineType {\n  BENGALI\n  INDIAN\n  ITALIAN\n  CHINESE\n  FAST_FOOD\n  THAI\n  MEXICAN\n  ARABIC\n  CONTINENTAL\n  DESSERT\n  OTHERS\n}\n\nmodel Review {\n  id         String   @id @default(uuid())\n  rating     Int      @default(5)\n  comment    String?  @db.Text\n  parentId   String?\n  customerId String\n  mealId     String\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  parent   Review?  @relation("ReviewReplies", fields: [parentId], references: [id], onDelete: Cascade)\n  replies  Review[] @relation("ReviewReplies")\n  customer User     @relation(fields: [customerId], references: [id])\n  meal     Meal     @relation(fields: [mealId], references: [id], onDelete: Cascade)\n\n  @@index([mealId])\n  @@index([customerId])\n  @@index([parentId])\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma" // generate root\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"providerName","kind":"scalar","type":"String"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"rivew","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CartToUser"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"CartItemToMeal"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":null},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"discountPrice","kind":"scalar","type":"Decimal"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"isVeg","kind":"scalar","type":"Boolean"},{"name":"spiciness","kind":"enum","type":"Spicy"},{"name":"isBestseller","kind":"scalar","type":"Boolean"},{"name":"prepTime","kind":"scalar","type":"Int"},{"name":"calories","kind":"scalar","type":"Int"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"},{"name":"rivew","kind":"object","type":"Review","relationName":"MealToReview"},{"name":"cart","kind":"object","type":"CartItem","relationName":"CartItemToMeal"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"orderNumber","kind":"scalar","type":"String"},{"name":"totalPrice","kind":"scalar","type":"Decimal"},{"name":"deliveryAddress","kind":"scalar","type":"String"},{"name":"phoneNumber","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentMethod","kind":"enum","type":"PaymentType"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"estimatedArrival","kind":"scalar","type":"DateTime"},{"name":"orderNotes","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Decimal"}],"dbName":null},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"businessName","kind":"scalar","type":"String"},{"name":"username","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"logoUrl","kind":"scalar","type":"String"},{"name":"coverUrl","kind":"scalar","type":"String"},{"name":"isOpen","kind":"scalar","type":"Boolean"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"cuisineType","kind":"enum","type":"CuisineType"},{"name":"deliveryFee","kind":"scalar","type":"Decimal"},{"name":"estimatedDeliveryTime","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"parent","kind":"object","type":"Review","relationName":"ReviewReplies"},{"name":"replies","kind":"object","type":"Review","relationName":"ReviewReplies"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CartItemScalarFieldEnum: () => CartItemScalarFieldEnum,
  CartScalarFieldEnum: () => CartScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MealScalarFieldEnum: () => MealScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProviderProfileScalarFieldEnum: () => ProviderProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Cart: "Cart",
  CartItem: "CartItem",
  Category: "Category",
  Meal: "Meal",
  Order: "Order",
  OrderItem: "OrderItem",
  ProviderProfile: "ProviderProfile",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  phone: "phone",
  status: "status",
  address: "address",
  providerName: "providerName"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartItemScalarFieldEnum = {
  id: "id",
  cartId: "cartId",
  mealId: "mealId",
  quantity: "quantity",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  image: "image"
};
var MealScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  price: "price",
  discountPrice: "discountPrice",
  imageUrl: "imageUrl",
  isAvailable: "isAvailable",
  isVeg: "isVeg",
  spiciness: "spiciness",
  isBestseller: "isBestseller",
  prepTime: "prepTime",
  calories: "calories",
  categoryId: "categoryId",
  providerId: "providerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  orderNumber: "orderNumber",
  totalPrice: "totalPrice",
  deliveryAddress: "deliveryAddress",
  phoneNumber: "phoneNumber",
  status: "status",
  paymentMethod: "paymentMethod",
  paymentStatus: "paymentStatus",
  estimatedArrival: "estimatedArrival",
  orderNotes: "orderNotes",
  customerId: "customerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  mealId: "mealId",
  quantity: "quantity",
  price: "price"
};
var ProviderProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  businessName: "businessName",
  username: "username",
  description: "description",
  address: "address",
  logoUrl: "logoUrl",
  coverUrl: "coverUrl",
  isOpen: "isOpen",
  isVerified: "isVerified",
  rating: "rating",
  totalReviews: "totalReviews",
  cuisineType: "cuisineType",
  deliveryFee: "deliveryFee",
  estimatedDeliveryTime: "estimatedDeliveryTime",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  parentId: "parentId",
  customerId: "customerId",
  mealId: "mealId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var OrderStatus = {
  PLACED: "PLACED",
  REJECTED: "REJECTED",
  PREPARING: "PREPARING",
  READY: "READY",
  ON_THE_WAY: "ON_THE_WAY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [env.ORIGIN_URL],
  advanced: {
    cookiePrefix: "better-auth",
    crossSubDomainCookies: {
      enabled: true
    },
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      path: "/"
    },
    cookies: {
      session_token: {
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: 60 * 60 * 24 * 7
        }
      }
    }
  },
  baseURL: env.BETTER_AUTH_URL,
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    // 7 days
    updateAge: 60 * 60 * 24
    // 1 day
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        // 'CUSTOMER' | 'PROVIDER' | 'ADMIN'
        input: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        // 'ACTIVE' | 'SUSPENDED'
        input: false
      },
      address: {
        type: "string",
        required: false
      },
      providerName: {
        type: "string",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false
  }
});

// src/modules/provider/provider.router.ts
import express from "express";

// src/modules/provider/provider.service.ts
import { Decimal as Decimal3 } from "@prisma/client/runtime/index-browser";
var createProviderMeal = async (payload, userId) => {
  const {
    name,
    description,
    price,
    discountPrice,
    imageUrl,
    isAvailable,
    isVeg,
    spiciness,
    isBestseller,
    prepTime,
    calories,
    categoryId,
    providerId
  } = payload;
  const providerExists = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (!providerExists) {
    throw new Error("Provider profile not found!");
  }
  const categoryExists = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  if (!categoryExists) {
    throw new Error("Invalid Category ID!");
  }
  const result = await prisma.meal.create({
    data: {
      name,
      description,
      imageUrl,
      isAvailable,
      isVeg,
      spiciness,
      isBestseller,
      prepTime,
      calories,
      categoryId,
      providerId: providerExists.id,
      // Decimal conversion
      price: new prismaNamespace_exports.Decimal(price),
      discountPrice: discountPrice ? new prismaNamespace_exports.Decimal(discountPrice) : null
    }
  });
  return result;
};
var getProviderFullProfile = async (providerId) => {
  const result = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    include: {
      user: {
        select: {
          email: true
        }
      },
      meals: {
        include: {
          category: true,
          rivew: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  return result;
};
var createProviderProfile = async (payload, userId) => {
  const isProfileExist = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (isProfileExist) {
    throw new Error("This user already has a provider profile!");
  }
  const result = await prisma.providerProfile.create({
    data: {
      businessName: payload.businessName,
      description: payload.description,
      address: payload.address,
      cuisineType: payload.cuisineType,
      deliveryFee: payload.deliveryFee,
      estimatedDeliveryTime: payload.estimatedDeliveryTime,
      logoUrl: payload.logoUrl,
      coverUrl: payload.coverUrl,
      // User relation connect kora hosse
      user: {
        connect: {
          id: userId
        }
      }
    }
  });
  return result;
};
var getProviderParterShipRequest = async () => {
  const result = await prisma.providerProfile.findMany();
  return result;
};
var getProviderOwnMeal = async (providerId) => {
  const profileWithMeals = await prisma.providerProfile.findUnique({
    where: { userId: providerId },
    include: {
      meals: {
        include: {
          category: true
        }
      }
    }
  });
  return profileWithMeals?.meals || [];
};
var updateOwnMeal = async (providerUserId, payload, mealId) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId: providerUserId }
  });
  if (!providerProfile) {
    throw new Error("Provider profile not found");
  }
  const result = await prisma.meal.update({
    where: {
      id: mealId,
      providerId: providerProfile.id
    },
    data: {
      name: payload.name,
      description: payload.description,
      price: payload.price ? new Decimal3(payload.price) : void 0,
      discountPrice: payload.discountPrice ? new Decimal3(payload.discountPrice) : null,
      imageUrl: payload.imageUrl,
      isAvailable: payload.isAvailable,
      isVeg: payload.isVeg,
      spiciness: payload.spiciness,
      // Enum: NONE, MILD, MEDIUM, HOT, EXTRA_HOT
      isBestseller: payload.isBestseller,
      prepTime: payload.prepTime ? Number(payload.prepTime) : void 0,
      calories: payload.calories ? Number(payload.calories) : void 0,
      categoryId: payload.categoryId
    }
  });
  return result;
};
var getProviderOwnOrders = async (providerUserId) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId: providerUserId }
  });
  if (!providerProfile) {
    throw new Error("Provider profile not found");
  }
  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          meal: {
            providerId: providerProfile.id
            // Meal মডেলের সাথে প্রোভাইডার যুক্ত
          }
        }
      }
    },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
          image: true
        }
      },
      items: {
        where: {
          meal: {
            providerId: providerProfile.id
            // শুধুমাত্র এই প্রোভাইডারের আইটেমগুলো দেখাবে
          }
        },
        include: {
          meal: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return orders;
};
var deleteOwnMeal = async (providerUserId, mealId) => {
  try {
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: providerUserId }
    });
    if (!providerProfile) throw new Error("Provider profile not found");
    const result = await prisma.meal.deleteMany({
      where: {
        id: mealId,
        providerId: providerProfile.id
      }
    });
    if (result.count === 0) throw new Error("Meal not found");
    return { success: true, message: "Meal deleted successfully" };
  } catch (error) {
    if (error.code === "P2003") {
      throw new Error(
        "\u098F\u0987 \u0996\u09BE\u09AC\u09BE\u09B0\u099F\u09BF \u09A1\u09BF\u09B2\u09BF\u099F \u0995\u09B0\u09BE \u09B8\u09AE\u09CD\u09AD\u09AC \u09A8\u09DF \u0995\u09BE\u09B0\u09A3 \u098F\u099F\u09BF \u0995\u09CB\u09A8\u09CB \u0985\u09B0\u09CD\u09A1\u09BE\u09B0\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09AF\u09C1\u0995\u09CD\u09A4 \u0986\u099B\u09C7\u0964"
      );
    }
    throw error;
  }
};
var providerService = {
  createProviderMeal,
  getProviderFullProfile,
  createProviderProfile,
  getProviderParterShipRequest,
  getProviderOwnMeal,
  updateOwnMeal,
  getProviderOwnOrders,
  deleteOwnMeal
};

// src/modules/provider/provider.controller.ts
var createProviderMeal2 = async (req, res) => {
  try {
    console.log("CONTROLLER CHECK:", req.body);
    const userId = req.user?.id;
    const result = await providerService.createProviderMeal(req.body, userId);
    res.status(201).json({
      success: true,
      message: "Meal created successfully",
      data: result
    });
  } catch (e) {
    res.status(400).json({
      error: "meals creation failed",
      details: e.message
    });
  }
};
var getProviderFullProfile2 = async (req, res) => {
  try {
    const { providerId } = req.params;
    const result = await providerService.getProviderFullProfile(
      providerId
    );
    res.status(200).json({ success: true, data: result });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
var createProviderProfile2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const result = await providerService.createProviderProfile(
      req.body,
      userId
    );
    res.status(200).json({
      success: true,
      message: "Provider Profile create successfull",
      data: result
    });
  } catch (error) {
    console.log(error);
  }
};
var getProviderParterShipRequest2 = async (req, res) => {
  try {
    const result = await providerService.getProviderParterShipRequest();
    res.status(201).json({
      success: true,
      message: "Get Provider Partner Ship request fetch successfull",
      data: result
    });
  } catch (error) {
    console.log(error.message);
  }
};
var getProviderOwnMeal2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const result = await providerService.getProviderOwnMeal(userId);
    res.status(200).json({
      success: true,
      message: "Provider own data fetch successfull",
      data: result
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something went worng!"
    });
  }
};
var updateOwnMeal2 = async (req, res) => {
  try {
    const providerUserId = req.user?.id;
    const { id: mealId } = req.params;
    const payload = req.body;
    const result = await providerService.updateOwnMeal(
      providerUserId,
      // ১ম প্যারামিটার
      payload,
      // ২য় প্যারামিটার
      mealId
      // ৩য় প্যারামিটার
    );
    res.status(200).json({
      success: true,
      message: "Meal update successful",
      data: result
    });
  } catch (error) {
    console.log("Error in Controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};
var getProviderOwnOrders2 = async (req, res) => {
  try {
    const providerUserId = req.user?.id;
    const result = await providerService.getProviderOwnOrders(
      providerUserId
    );
    res.status(200).json({
      success: true,
      message: "ownorder fetch succ",
      data: result
    });
  } catch (error) {
    console.log(error);
  }
};
var deleteOwnMeal2 = async (req, res) => {
  try {
    const providerUserId = req.user?.id;
    const { id: mealId } = req.params;
    const result = await providerService.deleteOwnMeal(
      providerUserId,
      mealId
    );
    res.status(200).json({
      success: true,
      message: "provider own meal delete successfull",
      data: result
    });
  } catch (error) {
    console.log(error);
  }
};
var providerController = {
  createProviderMeal: createProviderMeal2,
  getProviderFullProfile: getProviderFullProfile2,
  createProviderProfile: createProviderProfile2,
  getProviderParterShipRequest: getProviderParterShipRequest2,
  getProviderOwnMeal: getProviderOwnMeal2,
  updateOwnMeal: updateOwnMeal2,
  getProviderOwnOrders: getProviderOwnOrders2,
  deleteOwnMeal: deleteOwnMeal2
};

// src/middlewares/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!"
        });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required. Please verfiy your email!"
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        status: session.user.status,
        emailVerified: session.user.emailVerified,
        createdAt: session.user.createdAt,
        updatedAt: session.user.updatedAt
      };
      if (roles.length && !roles.includes(req.user?.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission to access this resources!"
        });
      }
    } catch (error) {
      console.log(error.message);
    }
    next();
  };
};

// src/modules/provider/provider.router.ts
var router = express.Router();
router.post(
  "/meals",
  auth2("PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */),
  providerController.createProviderMeal
);
router.get("/profile/:providerId", providerController.getProviderFullProfile);
router.post(
  "/become-a-partner",
  auth2("CUSTOMER" /* CUSTOMER */, "ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */),
  providerController.createProviderProfile
);
router.get(
  "/become-a-partner/request",
  auth2("ADMIN" /* ADMIN */),
  providerController.getProviderParterShipRequest
);
router.get(
  "/own-meals",
  auth2("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */, "CUSTOMER" /* CUSTOMER */),
  providerController.getProviderOwnMeal
);
router.patch(
  "/meals/:id",
  auth2("PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */),
  providerController.updateOwnMeal
);
router.get(
  "/meal-orders",
  auth2("CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */),
  providerController.getProviderOwnOrders
);
router.delete(
  "/meals/:id",
  auth2("PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */),
  providerController.deleteOwnMeal
);
var providerRouter = router;

// src/modules/meal/meal.router.ts
import express2 from "express";

// src/modules/meal/meal.service.ts
var getAllMeals = async () => {
  const meals = await prisma.meal.findMany({
    include: {
      // সরাসরি মিলের ক্যাটাগরি অন্তর্ভুক্ত করা হলো
      category: true,
      provider: {
        select: {
          id: true,
          businessName: true,
          rating: true,
          estimatedDeliveryTime: true,
          address: true
        }
      }
      /* provider: {
        include: {
           meals: true 
        }
      }
      */
    }
  });
  return meals;
};
var getMealCategories = async () => {
  const result = await prisma.category.findMany();
  return result;
};
var mealService = {
  getAllMeals,
  getMealCategories
};

// src/modules/meal/meal.controller.ts
var getAllMeals2 = async (req, res) => {
  try {
    const result = await mealService.getAllMeals();
    res.status(201).json({
      message: "All Meals fetch successfull",
      success: true,
      data: result
    });
  } catch (error) {
    console.log(error);
  }
};
var getMealsCategories = async (req, res) => {
  try {
    const result = await mealService.getMealCategories();
    res.status(201).json({
      message: "All categories are found!",
      success: true,
      data: result
    });
  } catch (error) {
    console.log(error.message);
  }
};
var mealController = {
  getAllMeals: getAllMeals2,
  getMealsCategories
};

// src/modules/meal/meal.router.ts
var router2 = express2.Router();
router2.get("/", mealController.getAllMeals);
router2.get("/categories", mealController.getMealsCategories);
var mealRouter = router2;

// src/modules/cart/cart.router.ts
import express3 from "express";

// src/modules/cart/cart.service.ts
var addMealToCart = async (userId, mealId, quantity = 1) => {
  const cart = await prisma.cart.upsert({
    where: { customerId: userId },
    update: {},
    create: { customerId: userId }
  });
  return await prisma.cartItem.upsert({
    where: {
      cartId_mealId: {
        cartId: cart.id,
        mealId
      }
    },
    update: {
      quantity: { increment: quantity }
    },
    create: {
      cartId: cart.id,
      mealId,
      quantity
    }
  });
};
var getMyCart = async (userId) => {
  return await prisma.cart.findUnique({
    where: { customerId: userId },
    include: {
      items: {
        include: {
          meal: true
        }
      }
    }
  });
};
var updateCartItemQuantity = async (itemId, action, userId) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true }
  });
  if (!item || item.cart.customerId !== userId) {
    throw new Error("Unauthorized or Item not found");
  }
  let newQuantity = action === "increase" ? item.quantity + 1 : item.quantity - 1;
  if (newQuantity < 1) {
    return await prisma.cartItem.delete({ where: { id: itemId } });
  }
  return await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: newQuantity }
  });
};
var deleteFromCart = async (itemId, userId) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true }
  });
  if (!item || item.cart.customerId !== userId) {
    throw new Error("Unauthorized or Item not found");
  }
  return await prisma.cartItem.delete({
    where: { id: itemId }
  });
};
var clearCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId: userId }
  });
  if (!cart) throw new Error("Cart not found");
  return await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  });
};
var cartServices = {
  addMealToCart,
  getMyCart,
  updateCartItemQuantity,
  clearCart,
  deleteFromCart
};

// src/modules/cart/cart.controller.ts
var addMealToCart2 = async (req, res) => {
  try {
    const { mealId, quantity } = req.body;
    const userId = req.user?.id;
    const result = await cartServices.addMealToCart(userId, mealId, quantity);
    res.status(200).json({ success: true, message: "Item added to cart", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getMyCart2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    const cart = await cartServices.getMyCart(userId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var updateQuantityController = async (req, res) => {
  try {
    const { itemId, action } = req.body;
    const userId = req.user.id;
    const updatedItem = await cartServices.updateCartItemQuantity(
      itemId,
      action,
      userId
      // UserId pathano holo security-r jonno
    );
    res.status(200).json({
      success: true,
      message: action === "increase" ? "Quantity increased" : "Quantity decreased",
      data: updatedItem
    });
  } catch (error) {
    res.status(400).json({
      // 500 er jaygay 400 dewa bhalo jodi validation error hoy
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};
var deleteCartItemController = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?.id;
    await cartServices.deleteFromCart(itemId, userId);
    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete item"
    });
  }
};
var clearCartController = async (req, res) => {
  try {
    const userId = req.user?.id;
    await cartServices.clearCart(userId);
    res.status(200).json({
      success: true,
      message: "Cart cleared successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to clear cart"
    });
  }
};
var cartControllers = {
  addMealToCart: addMealToCart2,
  getMyCart: getMyCart2,
  updateQuantityController,
  clearCartController,
  deleteCartItemController
};

// src/modules/cart/cart.router.ts
var router3 = express3.Router();
router3.post(
  "/add",
  auth2("CUSTOMER" /* CUSTOMER */, "ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */),
  cartControllers.addMealToCart
);
router3.get(
  "/",
  auth2("CUSTOMER" /* CUSTOMER */, "ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */),
  cartControllers.getMyCart
);
router3.patch(
  "/update-quantity",
  auth2("CUSTOMER" /* CUSTOMER */, "ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */),
  cartControllers.updateQuantityController
);
router3.delete(
  "/item/:itemId",
  auth2("CUSTOMER" /* CUSTOMER */, "ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */),
  cartControllers.deleteCartItemController
);
router3.delete(
  "/clear",
  auth2("CUSTOMER" /* CUSTOMER */, "ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */),
  cartControllers.clearCartController
);
var cartRouter = router3;

// src/modules/order/order.router.ts
import express4 from "express";

// src/modules/order/order.service.ts
var placeOrderService = async (userId, orderData) => {
  const {
    deliveryAddress,
    phoneNumber,
    orderNotes,
    riderTip,
    name,
    email,
    serviceFee,
    deliveryFee,
    paymentMethod
  } = orderData;
  const cart = await prisma.cart.findUnique({
    where: { customerId: userId },
    include: { items: { include: { meal: true } } }
  });
  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");
  const subtotal = cart.items.reduce(
    (acc, item) => acc + Number(item.meal.price) * item.quantity,
    0
  );
  const finalTotal = subtotal + Number(serviceFee) + Number(deliveryFee) + Number(riderTip);
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        totalPrice: finalTotal,
        deliveryAddress,
        phoneNumber,
        name,
        email,
        orderNotes,
        paymentMethod,
        customerId: userId,
        items: {
          create: cart.items.map((item) => ({
            mealId: item.mealId,
            quantity: item.quantity,
            price: item.meal.price
          }))
        }
      }
    });
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return order;
  });
};
var getUserOrders = async (userId) => {
  return await prisma.order.findMany({
    where: { customerId: userId },
    include: {
      items: {
        include: { meal: true }
        // Item-er bhetore meal details dekhabe
      }
    },
    orderBy: { createdAt: "desc" }
    // Notun order upore thakbe
  });
};
var SingleOrderDetails = async (orderId) => {
  const results = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: true,
      items: {
        include: {
          meal: true
        }
      }
    }
  });
  return results;
};
var orderServices = {
  placeOrderService,
  getUserOrders,
  SingleOrderDetails
};

// src/modules/order/order.controller.ts
var createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await orderServices.placeOrderService(userId, req.body);
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getUserOrders2 = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderServices.getUserOrders(userId);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var SingleOrderDetails2 = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const result = await orderServices.SingleOrderDetails(orderId);
    res.status(200).json({
      success: true,
      data: result,
      message: "order single deatils"
    });
  } catch (error) {
    console.log(error);
  }
};
var orderController = {
  createOrder,
  getUserOrders: getUserOrders2,
  SingleOrderDetails: SingleOrderDetails2
};

// src/modules/order/order.router.ts
var router4 = express4.Router();
router4.post(
  "/place-order",
  auth2("CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */),
  orderController.createOrder
);
router4.get(
  "/my-orders",
  auth2("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */),
  orderController.getUserOrders
);
router4.get(
  "/:id",
  auth2("PROVIDER" /* PROVIDER */, "ADMIN" /* ADMIN */),
  orderController.SingleOrderDetails
);
var orderRouter = router4;

// src/modules/review/review.router.ts
import express5 from "express";

// src/modules/review/review.services.ts
var createReview = async (payload) => {
  const { rating, comment, customerId, mealId } = payload;
  const user = await prisma.user.findUnique({
    where: { id: customerId }
  });
  if (!user) {
    throw new Error(
      `User not found with ID: ${customerId}. Please check if you are sending the correct User ID.`
    );
  }
  const isEligible = await prisma.order.findFirst({
    where: {
      customerId,
      status: OrderStatus.DELIVERED,
      items: {
        some: {
          mealId
        }
      }
    }
  });
  if (!isEligible) {
    throw new Error(
      "You can only review items that have been delivered to you."
    );
  }
  return await prisma.review.create({
    data: {
      rating: Number(rating),
      comment,
      customerId,
      // এটি অবশ্যই User.id হতে হবে
      mealId
    },
    include: {
      customer: {
        select: {
          name: true,
          image: true
        }
      }
    }
  });
};
var getMealReviews = async (mealId) => {
  return await prisma.review.findMany({
    where: {
      mealId,
      parentId: null
    },
    include: {
      customer: {
        select: { name: true, image: true }
      },
      replies: {
        include: {
          customer: { select: { name: true, image: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var reviewServices = {
  createReview,
  getMealReviews
};

// src/modules/review/review.controller.ts
var postReview = async (req, res) => {
  try {
    const review = await reviewServices.createReview(req.body);
    res.status(201).json({
      success: true,
      message: "Review posted successfully",
      data: review
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message || "Failed to post review"
    });
  }
};
var fetchReviews = async (req, res) => {
  try {
    const { mealId } = req.params;
    const reviews = await reviewServices.getMealReviews(mealId);
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews"
    });
  }
};
var reviewController = {
  postReview,
  fetchReviews
};

// src/modules/review/review.router.ts
var router5 = express5.Router();
router5.post(
  "/",
  auth2("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */),
  reviewController.postReview
);
router5.get("/:mealId", reviewController.fetchReviews);
var reviewRouter = router5;

// src/app.ts
var app = express6();
app.use(
  cors({
    origin: env.ORIGIN_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    exposedHeaders: ["set-cookie"],
    allowedHeaders: ["Content-Type", "Authorization", "set-cookie"]
  })
);
app.use(express6.json());
app.all("/api/auth/*path", toNodeHandler(auth));
app.use("/api/provider", providerRouter);
app.use("/api/meals", mealRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/reviews", reviewRouter);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
var app_default = app;

// src/server.ts
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    app_default.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
