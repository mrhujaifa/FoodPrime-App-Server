import express from "express";
import { providerController } from "./provider.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../types";

const router = express.Router();

router.post(
  "/meals",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  providerController.createProviderMeal,
);
router.get("/profile/:providerId", providerController.getProviderFullProfile);

router.post(
  "/become-a-partner",
  auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.PROVIDER),
  providerController.createProviderProfile,
);
router.get(
  "/become-a-partner/request",
  auth(UserRole.ADMIN),
  providerController.getProviderParterShipRequest,
);
router.get(
  "/own-meals",
  auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CUSTOMER),
  providerController.getProviderOwnMeal,
);

router.patch(
  "/meals/:id",
  auth(UserRole.PROVIDER, UserRole.ADMIN),
  providerController.updateOwnMeal,
);

export const providerRouter = router;
