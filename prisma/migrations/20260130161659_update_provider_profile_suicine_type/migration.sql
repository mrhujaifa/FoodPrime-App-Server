/*
  Warnings:

  - The `cuisineType` column on the `ProviderProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CuisineType" AS ENUM ('BENGALI', 'INDIAN', 'ITALIAN', 'CHINESE', 'FAST_FOOD', 'THAI', 'MEXICAN', 'ARABIC', 'CONTINENTAL', 'DESSERT', 'OTHERS');

-- AlterTable
ALTER TABLE "ProviderProfile" DROP COLUMN "cuisineType",
ADD COLUMN     "cuisineType" "CuisineType" DEFAULT 'OTHERS';
