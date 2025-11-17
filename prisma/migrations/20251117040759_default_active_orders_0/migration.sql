/*
  Warnings:

  - You are about to drop the column `locations` on the `items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."items" DROP COLUMN "locations",
ADD COLUMN     "activeOrders" INTEGER NOT NULL DEFAULT 0;
