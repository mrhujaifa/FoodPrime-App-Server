import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../types";
import { adminController } from "./admin.controller";

const router = express.Router();

// Route to get all users
router.get("/users", auth(UserRole.ADMIN), adminController.getAllUsers);

// Route to change user status
router.patch(
  "/users/:userId/status",
  auth(UserRole.ADMIN),
  adminController.changeUserStatus,
);

// Route to view all orders
router.get(
  "/users/orders",
  auth(UserRole.ADMIN),
  adminController.viewAllOrders,
);

export const adminRouter = router;
