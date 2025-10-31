/*
  Warnings:

  - You are about to drop the column `sellBy` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `stockBy` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `stockRef` on the `items` table. All the data in the column will be lost.
  - Added the required column `category` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."items" DROP COLUMN "sellBy",
DROP COLUMN "stockBy",
DROP COLUMN "stockRef",
ADD COLUMN     "category" TEXT NOT NULL;
