/*
  Warnings:

  - You are about to drop the column `name` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `items` table. All the data in the column will be lost.
  - Added the required column `SKU` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemName` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellBy` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockBy` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockRef` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrecision` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variationName` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."items" DROP COLUMN "name",
DROP COLUMN "price",
ADD COLUMN     "SKU" TEXT NOT NULL,
ADD COLUMN     "itemName" TEXT NOT NULL,
ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "sellBy" TEXT NOT NULL,
ADD COLUMN     "stockBy" TEXT NOT NULL,
ADD COLUMN     "stockRef" TEXT NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL,
ADD COLUMN     "unitPrecision" TEXT NOT NULL,
ADD COLUMN     "variationName" TEXT NOT NULL;
