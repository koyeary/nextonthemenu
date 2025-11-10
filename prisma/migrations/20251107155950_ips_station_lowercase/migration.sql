/*
  Warnings:

  - You are about to drop the `Ip` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "station" TEXT NOT NULL DEFAULT 'office';

-- DropTable
DROP TABLE "public"."Ip";

-- CreateTable
CREATE TABLE "public"."ips" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "station" TEXT NOT NULL,

    CONSTRAINT "ips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "orders_station_idx" ON "public"."orders"("station");
