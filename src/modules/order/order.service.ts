import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const placeOrderService = async (userId: string, orderData: any) => {
  const {
    deliveryAddress,
    phoneNumber,
    orderNotes,
    riderTip,
    name,
    email,
    serviceFee,
    deliveryFee,
    paymentMethod,
  } = orderData;

  const cart = await prisma.cart.findUnique({
    where: { customerId: userId },
    include: { items: { include: { meal: true } } },
  });

  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  const subtotal = cart.items.reduce(
    (acc, item) => acc + Number(item.meal.price) * item.quantity,
    0,
  );

  const finalTotal =
    subtotal + Number(serviceFee) + Number(deliveryFee) + Number(riderTip);

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
          create: cart.items.map((item: any) => ({
            mealId: item.mealId,
            quantity: item.quantity,
            price: item.meal.price,
          })),
        },
      },
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return order;
  });
};

const getUserOrders = async (userId: string) => {
  return await prisma.order.findMany({
    where: { customerId: userId },
    include: {
      items: {
        include: { meal: true }, // Item-er bhetore meal details dekhabe
      },
    },
    orderBy: { createdAt: "desc" }, // Notun order upore thakbe
  });
};

const SingleOrderDetails = async (orderId: string) => {
  const results = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: true,
      items: {
        include: {
          meal: true,
        },
      },
    },
  });

  return results;
};
const updateOrderStatus = async (
  orderId: string,
  userId: string, // এটা User.id
  newStatus: string,
) => {
  // 1) Validate status
  if (!Object.values(OrderStatus).includes(newStatus as OrderStatus)) {
    throw new Error("Invalid order status");
  }

  // 2) userId -> ProviderProfile
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (!providerProfile) {
    throw new Error("Provider profile not found");
  }

  const providerProfileId = providerProfile.id;

  // 3) Load order with items + meals
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { meal: true },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // 4) OWNERSHIP CHECK ✅
  const hasProviderMeal = order.items.some(
    (item) => item.meal.providerId === providerProfileId,
  );

  if (!hasProviderMeal) {
    throw new Error(
      "Unauthorized: You are not the owner of the meal in this order",
    );
  }

  // 5) Update status
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus as OrderStatus },
  });

  return updatedOrder;
};

export const orderServices = {
  placeOrderService,
  getUserOrders,
  SingleOrderDetails,
  updateOrderStatus,
};
