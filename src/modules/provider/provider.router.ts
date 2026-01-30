import express from "express";
import { providerController } from "./provider.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../types";

const router = express.Router();

router.post(
  "/meals",
  auth(UserRole.PROVIDER),
  providerController.createProviderMeal,
);
router.get(
  "/meals/:providerId",
  auth(UserRole.PROVIDER),
  providerController.getAllProviderMeals,
);

router.post(
  "/become-a-partner",
  auth(UserRole.CUSTOMER),
  providerController.createProviderProfile,
);

export const providerRouter = router;
