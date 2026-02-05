export type UpdateMealPayload = {
  name?: string;
  description?: string;
  price?: number | string;
  discountPrice?: number | string | null;
  imageUrl?: string | null;
  isAvailable?: boolean;
  isVeg?: boolean;
  spiciness?: Spicy;
  isBestseller?: boolean;
  prepTime?: number | string;
  calories?: number | string;
  categoryId?: string;
};

export enum Spicy {
  NONE = "NONE",
  MILD = "MILD",
  MEDIUM = "MEDIUM",
  HOT = "HOT",
  EXTRA_HOT = "EXTRA_HOT",
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number | string;
  discountPrice?: number | string | null;
  imageUrl?: string | null;
  isAvailable: boolean;
  isVeg: boolean;
  spiciness: Spicy;
  isBestseller: boolean;
  prepTime?: number | null;
  calories?: number | null;
  categoryId: string;
  providerId: string;

  createdAt: Date | string;
  updatedAt: Date | string;
}
