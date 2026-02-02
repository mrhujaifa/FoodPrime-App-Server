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
          address: true,
        },
      },
      _count: true,
    },
  });
  return meals;
};

const getMealCategories = async () => {
  const result = await prisma.category.findMany();
  return result;
};

export const mealService = {
  getAllMeals,
  getMealCategories,
};
