/*
  Warnings:

  - The `status` column on the `subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'paused', 'trialing', 'unpaid');

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "status",
ADD COLUMN     "status" "Status" DEFAULT 'incomplete';
