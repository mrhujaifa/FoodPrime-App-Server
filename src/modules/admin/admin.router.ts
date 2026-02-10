import express from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../types";
import { adminController } from "./admin.controller";

const router = express.Router();

router.get("/users", auth(UserRole.ADMIN), adminController.getAllUsers);

export const adminRouter = router;
