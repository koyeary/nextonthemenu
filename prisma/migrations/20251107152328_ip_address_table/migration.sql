-- CreateTable
CREATE TABLE "public"."Ip" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "station" TEXT NOT NULL,

    CONSTRAINT "Ip_pkey" PRIMARY KEY ("id")
);
