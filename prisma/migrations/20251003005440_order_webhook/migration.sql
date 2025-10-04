/*
  Warnings:

  - The primary key for the `WebhookEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `WebhookEvent` table. All the data in the column will be lost.
  - You are about to drop the column `eventType` on the `WebhookEvent` table. All the data in the column will be lost.
  - You are about to drop the column `payload` on the `WebhookEvent` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `WebhookEvent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `WebhookEvent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `location_id` to the `WebhookEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."WebhookEvent" DROP CONSTRAINT "WebhookEvent_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "eventType",
DROP COLUMN "payload",
DROP COLUMN "provider",
ADD COLUMN     "location_id" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT;
DROP SEQUENCE "WebhookEvent_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "WebhookEvent_id_key" ON "public"."WebhookEvent"("id");
