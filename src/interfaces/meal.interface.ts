import { Decimal } from "@prisma/client/runtime/index-browser";
import { Spicy } from "../../generated/prisma/enums";

export interface IMeal {
  id: string;
  name: string;
  description: string;
  price: Decimal | number;
  discountPrice?: Decimal | number | null;
  imageUrl?: string | null;
  isAvailable: boolean;
  isVeg: boolean;
  spiciness: Spicy;
  isBestseller: boolean;
  prepTime?: number | null;
  calories?: number | null;
  categoryId: string;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ICreateMeal = Omit<IMeal, "id" | "createdAt" | "updatedAt">;
