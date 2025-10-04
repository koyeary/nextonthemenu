/*
  Warnings:

  - You are about to drop the column `items` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `orders` table. All the data in the column will be lost.
  - Added the required column `item` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "items",
DROP COLUMN "size",
ADD COLUMN     "item" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL;
