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

export const adminService = {
  getAllUsers,
};
