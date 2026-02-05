import { Request, Response } from "express";
import { reviewServices } from "./review.services";

const postReview = async (req: Request, res: Response) => {
  try {
    const review = await reviewServices.createReview(req.body);
    res.status(201).json({
      success: true,
      message: "Review posted successfully",
      data: review,
    });
  } catch (error: any) {
    // এখানে সার্ভিস থেকে আসা Error মেসেজটি হ্যান্ডেল করা হচ্ছে
    res.status(403).json({
      success: false,
      message: error.message || "Failed to post review",
    });
  }
};

const fetchReviews = async (req: Request, res: Response) => {
  try {
    const { mealId } = req.params;
    const reviews = await reviewServices.getMealReviews(mealId as string);
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
    });
  }
};

export const reviewController = {
  postReview,
  fetchReviews,
};
