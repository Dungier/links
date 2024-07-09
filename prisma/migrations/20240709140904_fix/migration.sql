/*
  Warnings:

  - The primary key for the `Links` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Links` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `Links` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `used` to the `Links` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Links" DROP CONSTRAINT "Links_pkey",
DROP COLUMN "id",
ADD COLUMN     "used" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Links_token_key" ON "Links"("token");
