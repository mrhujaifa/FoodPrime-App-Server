import { prisma } from "../../lib/prisma";

const addMealToCart = async (
  userId: string,
  mealId: string,
  quantity: number = 1,
) => {
  const cart = await prisma.cart.upsert({
    where: { customerId: userId },
    update: {},
    create: { customerId: userId },
  });

  return await prisma.cartItem.upsert({
    where: {
      cartId_mealId: {
        cartId: cart.id,
        mealId: mealId,
      },
    },
    update: {
      quantity: { increment: quantity },
    },
    create: {
      cartId: cart.id,
      mealId: mealId,
      quantity: quantity,
    },
  });
};

const getMyCart = async (userId: string) => {
  return await prisma.cart.findUnique({
    where: { customerId: userId },
    include: {
      items: {
        include: {
          meal: true,
        },
      },
    },
  });
};

const updateCartItemQuantity = async (
  itemId: string,
  action: "increase" | "decrease",
  userId: string, // userId parameter add kora holo
) => {
  // ১. আইটেমটি খোঁজা এবং সাথে কার্ট ডাটা চেক করা (Security)
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  // ২. যদি আইটেম না থাকে বা আইটেমটি অন্য ইউজারের হয়
  if (!item || item.cart.customerId !== userId) {
    throw new Error("Unauthorized or Item not found");
  }

  let newQuantity =
    action === "increase" ? item.quantity + 1 : item.quantity - 1;

  if (newQuantity < 1) {
    return await prisma.cartItem.delete({ where: { id: itemId } });
  }

  return await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: newQuantity },
  });
};

export const cartServices = {
  addMealToCart,
  getMyCart,
  updateCartItemQuantity,
};
