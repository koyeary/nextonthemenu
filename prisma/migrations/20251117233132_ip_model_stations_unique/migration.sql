/*
  Warnings:

  - The primary key for the `ips` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ips` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."ips_address_key";

-- AlterTable
ALTER TABLE "public"."ips" DROP CONSTRAINT "ips_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ips_pkey" PRIMARY KEY ("station");
