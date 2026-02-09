import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../types";
import { orderController } from "./order.controller";

const router = express.Router();
router.post(
  "/place-order",
  auth(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN),
  orderController.createOrder,
);

router.get(
  "/my-orders",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  orderController.getUserOrders,
);

router.get(
  "/:id",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  orderController.SingleOrderDetails,
);

router.patch(
  "/:orderId/status",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  orderController.updateOrderStatus,
);

export const orderRouter = router;
