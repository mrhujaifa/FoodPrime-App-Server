import { prisma } from "../../lib/prisma";

const getAllMeals = async () => {
  const meals = await prisma.meal.findMany({
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          rating: true,
          estimatedDeliveryTime: true,
        },
      },
    },
  });
  return meals;
};

export const mealService = {
  getAllMeals,
};
