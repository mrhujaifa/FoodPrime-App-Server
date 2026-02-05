import { Decimal } from "@prisma/client/runtime/index-browser";
import { Prisma } from "../../../generated/prisma/client";
import { ICreateMeal } from "../../interfaces/meal.interface";
import { ICreateProviderProfile } from "../../interfaces/providerProfile.interface";
import { prisma } from "../../lib/prisma";

const createProviderMeal = async (payload: ICreateMeal, userId: string) => {
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
    where: { userId: userId },
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
      providerId: providerExists.id,
      // Decimal conversion
      price: new Prisma.Decimal(price as number),
      discountPrice: discountPrice
        ? new Prisma.Decimal(discountPrice as number)
        : null,
    },
  });

  return result;
};

const getProviderFullProfile = async (providerId: string) => {
  const result = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    include: {
      user: {
        select: {
          email: true,
        },
      },
      meals: {
        include: {
          category: true,
          rivew: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return result;
};

const createProviderProfile = async (
  payload: ICreateProviderProfile,
  userId: string,
) => {
  const isProfileExist = await prisma.providerProfile.findUnique({
    where: { userId },
  });

  if (isProfileExist) {
    throw new Error("This user already has a provider profile!");
  }

  const result = await prisma.providerProfile.create({
    data: {
      businessName: payload.businessName,
      description: payload.description,
      address: payload.address,
      cuisineType: payload.cuisineType,
      deliveryFee: payload.deliveryFee,
      estimatedDeliveryTime: payload.estimatedDeliveryTime,
      logoUrl: payload.logoUrl,
      coverUrl: payload.coverUrl,
      // User relation connect kora hosse
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return result;
};

// const getSingleProviderProfile

const getProviderParterShipRequest = async () => {
  const result = await prisma.providerProfile.findMany();
  return result;
};

const getProviderOwnMeal = async (providerId: string) => {
  const profileWithMeals = await prisma.providerProfile.findUnique({
    where: { userId: providerId },
    include: {
      meals: {
        include: {
          category: true,
        },
      },
    },
  });

  return profileWithMeals?.meals || [];
};

const updateOwnMeal = async (
  providerUserId: string,
  payload: any,
  mealId: string,
) => {
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId: providerUserId },
  });

  if (!providerProfile) {
    throw new Error("Provider profile not found");
  }

  const result = await prisma.meal.update({
    where: {
      id: mealId,
      providerId: providerProfile.id,
    },
    data: {
      name: payload.name,
      description: payload.description,
      price: payload.price ? new Decimal(payload.price) : undefined,
      discountPrice: payload.discountPrice
        ? new Decimal(payload.discountPrice)
        : null,
      imageUrl: payload.imageUrl,
      isAvailable: payload.isAvailable,
      isVeg: payload.isVeg,
      spiciness: payload.spiciness, // Enum: NONE, MILD, MEDIUM, HOT, EXTRA_HOT
      isBestseller: payload.isBestseller,
      prepTime: payload.prepTime ? Number(payload.prepTime) : undefined,
      calories: payload.calories ? Number(payload.calories) : undefined,
      categoryId: payload.categoryId,
    },
  });
  return result;
};

export const providerService = {
  createProviderMeal,
  getProviderFullProfile,
  createProviderProfile,
  getProviderParterShipRequest,
  getProviderOwnMeal,
  updateOwnMeal,
};
