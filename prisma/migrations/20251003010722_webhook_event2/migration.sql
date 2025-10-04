/*
  Warnings:

  - You are about to drop the column `location_id` on the `WebhookEvent` table. All the data in the column will be lost.
  - Added the required column `eventType` to the `WebhookEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payload` to the `WebhookEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `WebhookEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."WebhookEvent" DROP COLUMN "location_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "eventType" TEXT NOT NULL,
ADD COLUMN     "payload" JSONB NOT NULL,
ADD COLUMN     "provider" TEXT NOT NULL;
