import express from "express";
import { mealController } from "./meal.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../types";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CUSTOMER),
  mealController.getAllMeals,
);
router.get(
  "/categories",
  auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CUSTOMER),
  mealController.getMealsCategories,
);

export const mealRouter = router;
