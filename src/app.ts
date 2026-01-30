import express, { Application } from "express";
import cors from "cors";
import { env } from "./lib/env";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { providerRouter } from "./modules/provider/provider.router";

const app: Application = express();

app.use(
  cors({
    origin: env.ORIGIN_URL,
    credentials: true,
  }),
);

app.use(express.json());

// auth router from better auth
app.all("/api/auth/*splat", toNodeHandler(auth));

//provider router
app.use("/api/provider", providerRouter);

// root router response
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

export default app;
