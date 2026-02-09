import { Request, Response } from "express";
import { orderServices } from "./order.service";

const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // Assume auth middleware added
    const order = await orderServices.placeOrderService(userId, req.body);

    res.status(201).json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await orderServices.getUserOrders(userId);

    res.status(200).json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const SingleOrderDetails = async (req: Request, res: Response) => {
  try {
    const { id: orderId } = req.params;
    const result = await orderServices.SingleOrderDetails(orderId as string);

    res.status(200).json({
      success: true,
      data: result,
      message: "order single deatils",
    });
  } catch (error) {
    console.log(error);
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const providerId = req.user?.id;
    const { status: newStatus } = req.body;

    const updatedOrder = await orderServices.updateOrderStatus(
      orderId as string,
      providerId as string,
      newStatus,
    );

    res.status(200).json({
      success: true,
      data: updatedOrder,
      message: "Order status updated successfully",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const orderController = {
  createOrder,
  getUserOrders,
  SingleOrderDetails,
  updateOrderStatus,
};
