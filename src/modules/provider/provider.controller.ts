import { Request, Response } from "express";
import { providerService } from "./provider.service";

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

export const providerController = {
  createProviderMeal,
  getProviderFullProfile,
  createProviderProfile,
  getProviderParterShipRequest,
  getProviderOwnMeal,
};
