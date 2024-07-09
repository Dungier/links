-- CreateTable
CREATE TABLE "Links" (
    "id" SERIAL NOT NULL,
    "token" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Links_pkey" PRIMARY KEY ("id")
);
