import express, { Application } from "express";
import cors from "cors";
import { env } from "./lib/env";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { providerRouter } from "./modules/provider/provider.router";
import { mealRouter } from "./modules/meal/meal.router";
import { cartRouter } from "./modules/cart/cart.router";

const app: Application = express();

app.use(
  cors({
    origin: env.ORIGIN_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

app.use(express.json());

// auth router from better auth
app.all("/api/auth/*splat", toNodeHandler(auth));

//provider router
app.use("/api/provider", providerRouter);

// meal router
app.use("/api/meals", mealRouter);

// cart router
app.use("/api/cart", cartRouter);

// root router response
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
