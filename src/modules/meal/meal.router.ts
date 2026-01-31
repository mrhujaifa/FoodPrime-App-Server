import express from "express";
import { mealController } from "./meal.controller";

const router = express.Router();

router.get("/", mealController.getAllMeals);

export const mealRouter = router;
