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

const changeUserStatus = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.id as string;
    const status = req.body.status as string;
    const { userId } = req.params;
    const result = await adminService.changeUserStatus(
      adminId,
      userId as string,
      status,
    );
    res.status(200).json({
      success: true,
      message: "User status changed successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to change user status",
      error: error,
    });
  }
};

const viewAllOrders = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.id as string;
    const result = await adminService.viewAllOrders(adminId);
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: error,
    });
  }
};
export const adminController = {
  getAllUsers,
  changeUserStatus,
  viewAllOrders,
};
