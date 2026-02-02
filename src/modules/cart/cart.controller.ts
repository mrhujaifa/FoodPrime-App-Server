import { Request, Response } from "express";
import { cartServices } from "./cart.service";

const addMealToCart = async (req: Request, res: Response) => {
  try {
    const { mealId, quantity } = req.body;
    const userId = req.user?.id as string;

    const result = await cartServices.addMealToCart(userId, mealId, quantity);
    res
      .status(200)
      .json({ success: true, message: "Item added to cart", data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const cart = await cartServices.getMyCart(userId as string);
    res.status(200).json({ success: true, data: cart });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateQuantityController = async (req: Request, res: Response) => {
  try {
    const { itemId, action } = req.body;
    const userId = (req as any).user.id; // Auth middleware theke userId nite hobe

    const updatedItem = await cartServices.updateCartItemQuantity(
      itemId,
      action,
      userId, // UserId pathano holo security-r jonno
    );

    res.status(200).json({
      success: true,
      message:
        action === "increase" ? "Quantity increased" : "Quantity decreased",
      data: updatedItem,
    });
  } catch (error: any) {
    res.status(400).json({
      // 500 er jaygay 400 dewa bhalo jodi validation error hoy
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const deleteCartItemController = async (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?.id; // Authenticated user ID

    await cartServices.deleteFromCart(itemId as string, userId as string);

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete item",
    });
  }
};

// 2. Clear Full Cart Controller
export const clearCartController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    await cartServices.clearCart(userId as string);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to clear cart",
    });
  }
};

export const cartControllers = {
  addMealToCart,
  getMyCart,
  updateQuantityController,
  clearCartController,
  deleteCartItemController,
};
