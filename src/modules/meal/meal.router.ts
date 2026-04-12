import express from "express";
import { mealController } from "./meal.controller";

const router = express.Router();

router.get("/", mealController.getAllMeals);
router.get("/categories", mealController.getMealsCategories);

export const mealRouter = router;
