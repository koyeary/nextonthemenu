/*
  Warnings:

  - The `id` column on the `WebhookEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "public"."WebhookEvent_id_key";

-- AlterTable
ALTER TABLE "public"."WebhookEvent" DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id");
