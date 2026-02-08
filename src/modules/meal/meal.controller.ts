import { Request, Response } from "express";
import { mealService } from "./meal.service";

const getAllMeals = async (req: Request, res: Response) => {
  try {
    const result = await mealService.getAllMeals();
    res.status(201).json({
      message: "All Meals fetch successfull",
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
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
