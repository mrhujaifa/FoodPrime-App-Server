import { Request, Response } from "express";
import { providerService } from "./provider.service";

const createProviderMeal = async (req: Request, res: Response) => {
  try {
    console.log("CONTROLLER CHECK:", req.body);
    const result = await providerService.createProviderMeal(req.body);
    res.status(201).json(result);
  } catch (e: any) {
    res.status(400).json({
      error: "meals creation failed",
      details: e.message,
    });
  }
};

const getAllProviderMeals = async (req: Request, res: Response) => {
  try {
    const { providerId } = req.params;
    const result = await providerService.getAllProviderMeals(
      providerId as string,
    );
    res.status(200).json({ success: true, data: result });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const providerController = {
  createProviderMeal,
  getAllProviderMeals,
};
