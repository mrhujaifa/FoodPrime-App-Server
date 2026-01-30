import { Decimal } from "@prisma/client/runtime/index-browser";
import { CuisineType } from "../../generated/prisma/enums";

export interface IProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  description?: string | null;
  address: string;
  logoUrl?: string | null;
  coverUrl?: string | null;
  isOpen: boolean;
  isVerified: boolean;
  rating?: number;
  totalReviews: number;
  cuisineType?: CuisineType;
  deliveryFee: Decimal | number;
  estimatedDeliveryTime?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// প্রোফাইল তৈরি করার জন্য টাইপ
export type ICreateProviderProfile = Omit<
  IProviderProfile,
  "id" | "createdAt" | "updatedAt"
>;
