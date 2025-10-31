/*
  Warnings:

  - You are about to drop the column `SKU` on the `items` table. All the data in the column will be lost.
  - Added the required column `sku` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."items" DROP COLUMN "SKU",
ADD COLUMN     "sku" TEXT NOT NULL;
