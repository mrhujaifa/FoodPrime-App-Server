import { Request, Response } from "express";
import { providerService } from "./provider.service.js";

const createProviderMeal = async (req: Request, res: Response) => {
  try {
    console.log("CONTROLLER CHECK:", req.body);
    const userId = (req as any).user?.id;
    const result = await providerService.createProviderMeal(req.body, userId);
    res.status(201).json({
      success: true,
      message: "Meal created successfully",
      data: result,
    });
  } catch (e: any) {
    res.status(400).json({
      error: "meals creation failed",
      details: e.message,
    });
  }
};

const getProviderFullProfile = async (req: Request, res: Response) => {
  try {
    const { providerId } = req.params;
    const result = await providerService.getProviderFullProfile(
      providerId as string,
    );
    res.status(200).json({ success: true, data: result });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

const createProviderProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const result = await providerService.createProviderProfile(
      req.body,
      userId,
    );
    res.status(200).json({
      success: true,
      message: "Provider Profile create successfull",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const getProviderParterShipRequest = async (req: Request, res: Response) => {
  try {
    const result = await providerService.getProviderParterShipRequest();
    res.status(201).json({
      success: true,
      message: "Get Provider Partner Ship request fetch successfull",
      data: result,
    });
  } catch (error: any) {
    console.log(error.message);
  }
};

const getProviderOwnMeal = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const result = await providerService.getProviderOwnMeal(userId as string);

    res.status(200).json({
      success: true,
      message: "Provider own data fetch successfull",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something went worng!",
    });
  }
};

const updateOwnMeal = async (req: Request, res: Response) => {
  try {
    const providerUserId = req.user?.id; // এটি আপনার সার্ভিসের ১ম প্যারামিটার
    const { id: mealId } = req.params; // এটি আপনার সার্ভিসের ৩য় প্যারামিটার
    const payload = req.body; // এটি আপনার সার্ভিসের ২য় প্যারামিটার

    // সার্ভিসের সিরিয়াল অনুযায়ী প্যারামিটারগুলো পাঠাতে হবে:
    // updateOwnMeal(providerUserId, payload, mealId)
    const result = await providerService.updateOwnMeal(
      providerUserId as string, // ১ম প্যারামিটার
      payload, // ২য় প্যারামিটার
      mealId as string, // ৩য় প্যারামিটার
    );

    res.status(200).json({
      success: true,
      message: "Meal update successful",
      data: result,
    });
  } catch (error: any) {
    console.log("Error in Controller:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getProviderOwnOrders = async (req: Request, res: Response) => {
  try {
    const providerUserId = req.user?.id;
    const result = await providerService.getProviderOwnOrders(
      providerUserId as string,
    );

    res.status(200).json({
      success: true,
      message: "ownorder fetch succ",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteOwnMeal = async (req: Request, res: Response) => {
  try {
    const providerUserId = req.user?.id;
    const { id: mealId } = req.params;
    const result = await providerService.deleteOwnMeal(
      providerUserId as string,
      mealId as string,
    );

    res.status(200).json({
      success: true,
      message: "provider own meal delete successfull",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const providerController = {
  createProviderMeal,
  getProviderFullProfile,
  createProviderProfile,
  getProviderParterShipRequest,
  getProviderOwnMeal,
  updateOwnMeal,
  getProviderOwnOrders,
  deleteOwnMeal,
};
