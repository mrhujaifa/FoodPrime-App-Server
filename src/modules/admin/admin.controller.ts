import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.id as string;
    const result = await adminService.getAllUsers(adminId);
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error: error,
    });
  }
};

export const adminController = {
  getAllUsers,
};
