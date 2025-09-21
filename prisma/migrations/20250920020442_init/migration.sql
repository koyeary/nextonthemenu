
-- DropTable
DROP TABLE "public"."Order";

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "due" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "notes" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(8,2) NOT NULL,
    "customer_name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderId_key" ON "public"."orders"("orderId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "public"."orders"("status");

-- CreateIndex
CREATE INDEX "orders_due_idx" ON "public"."orders"("due");
