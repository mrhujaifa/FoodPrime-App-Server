import express, { Application } from "express";
import cors from "cors";
import { env } from "./lib/env";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { providerRouter } from "./modules/provider/provider.router";
import { mealRouter } from "./modules/meal/meal.router";
import { cartRouter } from "./modules/cart/cart.router";
import { orderRouter } from "./modules/order/order.router";
import { reviewRouter } from "./modules/review/review.router";
import { adminRouter } from "./modules/admin/admin.router";

const app: Application = express();

app.use(
  cors({
    origin: env.ORIGIN_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
    exposedHeaders: ["set-cookie"],
    allowedHeaders: ["Content-Type", "Authorization", "set-cookie"],
  }),
);

app.use(express.json());

// auth router from better auth
app.all("/api/auth/*path", toNodeHandler(auth));

//provider router
app.use("/api/provider", providerRouter);

// meal router
app.use("/api/meals", mealRouter);

// cart router
app.use("/api/cart", cartRouter);

// order router
app.use("/api/order", orderRouter);

// review router
app.use("/api/reviews", reviewRouter);

// admin router
app.use("/api/admin", adminRouter);

// root router response
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
