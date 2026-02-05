import { Request, Response } from "express";
import { mealService } from "./meal.service";
import { prisma } from "../../lib/prisma";

export const getAllMeals = async (req: Request, res: Response) => {
  const { category, dietary, price } = req.query;

  let query: any = {};

  // Category Filter (Cuisine mapping)
  if (category) {
    query.category = {
      name: { in: (category as string).split(",") },
    };
  }

  // Dietary Filter (isVeg mapping)
  if (dietary) {
    const dietaryList = (dietary as string).split(",");
    if (dietaryList.includes("Vegetarian")) {
      query.isVeg = true;
    }
  }

  // Price Filter mapping
  if (price) {
    if (price === "low") query.price = { lte: 200 };
    if (price === "medium") query.price = { gt: 200, lte: 500 };
    if (price === "high") query.price = { gt: 500 };
  }

  const meals = await prisma.meal.findMany({
    where: query,
    include: { category: true, provider: true },
  });

  res.json({ success: true, data: meals });
};

const getMealsCategories = async (req: Request, res: Response) => {
  try {
    const result = await mealService.getMealCategories();
    res.status(201).json({
      message: "All categories are found!",
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

export const mealController = {
  getAllMeals,
  getMealsCategories,
};
