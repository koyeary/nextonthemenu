/*
  Warnings:

  - The primary key for the `ips` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[station,locationCode]` on the table `ips` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."ips" DROP CONSTRAINT "ips_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "locationCode" TEXT NOT NULL DEFAULT 'L56CFWYF0H5JK',
ADD CONSTRAINT "ips_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "ips_station_locationCode_key" ON "public"."ips"("station", "locationCode");
