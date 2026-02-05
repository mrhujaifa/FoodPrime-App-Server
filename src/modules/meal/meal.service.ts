import { prisma } from "../../lib/prisma";

const getAllMeals = async () => {
  const meals = await prisma.meal.findMany({
    include: {
      // সরাসরি মিলের ক্যাটাগরি অন্তর্ভুক্ত করা হলো
      category: true,
      provider: {
        select: {
          id: true,
          businessName: true,
          rating: true,
          estimatedDeliveryTime: true,
          address: true,
        },
      },

      /* provider: {
        include: {
           meals: true 
        }
      }
      */
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
