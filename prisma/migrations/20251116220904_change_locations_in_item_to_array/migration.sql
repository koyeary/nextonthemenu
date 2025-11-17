/*
  Warnings:

  - You are about to drop the column `location` on the `items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."items" DROP COLUMN "location",
ADD COLUMN     "locations" TEXT[];
