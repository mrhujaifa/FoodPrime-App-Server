import { Prisma } from "../../../generated/prisma/client";
import { ICreateMeal } from "../../interfaces/meal.interface";
import { prisma } from "../../lib/prisma";

const createProviderMeal = async (payload: ICreateMeal) => {
  const {
    name,
    description,
    price,
    discountPrice,
    imageUrl,
    isAvailable,
    isVeg,
    spiciness,
    isBestseller,
    prepTime,
    calories,
    categoryId,
    providerId,
  } = payload;

  const providerExists = await prisma.providerProfile.findUnique({
    where: { id: providerId },
  });

  if (!providerExists) {
    throw new Error("Provider profile not found!");
  }

  const categoryExists = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!categoryExists) {
    throw new Error("Invalid Category ID!");
  }

  const result = await prisma.meal.create({
    data: {
      name,
      description,
      imageUrl,
      isAvailable,
      isVeg,
      spiciness,
      isBestseller,
      prepTime,
      calories,
      categoryId,
      providerId,
      // Decimal conversion
      price: new Prisma.Decimal(price as number),
      discountPrice: discountPrice
        ? new Prisma.Decimal(discountPrice as number)
        : null,
    },
  });

  return result;
};

const getAllProviderMeals = async (providerId: string) => {
  const result = await prisma.meal.findMany({
    where: { providerId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

export const providerService = {
  createProviderMeal,
  getAllProviderMeals,
};
