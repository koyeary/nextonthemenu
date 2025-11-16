/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "items_token_key" ON "public"."items"("token");
