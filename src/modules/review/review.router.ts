import express from "express";
import { reviewController } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../types";

const router = express.Router();

// POST: /api/reviews
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PROVIDER),
  reviewController.postReview,
);

// GET: /api/reviews/:mealId
router.get("/:mealId", reviewController.fetchReviews);
export const reviewRouter = router;
