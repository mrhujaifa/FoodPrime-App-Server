import express from "express";
import { cartControllers } from "./cart.controller";
import { UserRole } from "../../types";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/add",
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PROVIDER),
  cartControllers.addMealToCart,
);

router.get(
  "/",
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PROVIDER),
  cartControllers.getMyCart,
);

router.patch(
  "/update-quantity",
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PROVIDER),
  cartControllers.updateQuantityController,
);

export const cartRouter = router;
