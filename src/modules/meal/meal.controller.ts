import { Request, Response } from "express";
import { mealService } from "./meal.service";

const getAllMeals = async (req: Request, res: Response) => {
  try {
    const result = await mealService.getAllMeals();

    res.status(200).json({
      message: "All meals fetched successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error fetching all meals:", error);

    res.status(500).json({
      message: error?.message || "Failed to fetch meals",
      success: false,
      data: null,
    });
  }
};

const getMealsCategories = async (req: Request, res: Response) => {
  try {
    const result = await mealService.getMealCategories();

    res.status(200).json({
      message: "All categories found successfully",
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error fetching meal categories:", error);

    res.status(500).json({
      message: error?.message || "Failed to fetch meal categories",
      success: false,
      data: null,
    });
  }
};

export const mealController = {
  getAllMeals,
  getMealsCategories,
};
