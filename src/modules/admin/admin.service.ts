import { prisma } from "../../lib/prisma";

const getAllUsers = async (adminId: string) => {
  const isAdmin = prisma.user.findUnique({
    where: {
      id: adminId,
      role: "ADMIN",
    },
  });

  if (!isAdmin) {
    throw new Error(
      "Unauthorized access - Admins only allowed  to access this resource",
    );
  }

  const users = await prisma.user.findMany();

  if (!users) {
    throw new Error("No users found");
  }

  return users;
};

const changeUserStatus = async (
  adminId: string, // Admin ID to verify admin access
  userId: string, // User ID whose status is to be changed
  status: string, // New status to be set for the user
) => {
  console.log(status);
  const isAdmin = prisma.user.findUnique({
    where: { id: adminId, role: "ADMIN" },
  });

  if (!isAdmin) {
    throw new Error(
      "Unauthorized access - Admins only allowed  to access this resource",
    );
  }

  console.log("stauts....................", status);
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  return updatedUser;
};

const viewAllOrders = async (adminId: string) => {
  const isAdmin = prisma.order.findUnique({
    where: {
      id: adminId,
    },
  });

  if (!isAdmin) {
    throw new Error(
      "Unauthorized access - Admins only allowed  to access this resource",
    );
  }

  const orders = await prisma.order.findMany({
    include: {
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: true,
    },
  });

  if (!orders) {
    throw new Error("No orders found");
  }
  if (orders.length === 0) {
    throw new Error("No orders found");
  }

  return orders;
};

export const adminService = {
  getAllUsers,
  changeUserStatus,
  viewAllOrders,
};
