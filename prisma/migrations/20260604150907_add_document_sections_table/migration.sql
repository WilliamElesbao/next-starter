-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DONE', 'IN_PROCESS');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('COVER_PAGE', 'TABLE_OF_CONTENTS', 'NARRATIVE', 'TECHNICAL_CONTENT', 'PLAIN_LANGUAGE', 'LEGAL', 'VISUAL', 'FINANCIAL', 'RESEARCH', 'PLANNING');

-- CreateTable
CREATE TABLE "document_sections" (
    "id" TEXT NOT NULL,
    "header" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "status" "DocumentStatus" NOT NULL,
    "target" INTEGER NOT NULL,
    "limit" INTEGER NOT NULL,
    "reviewer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_sections_pkey" PRIMARY KEY ("id")
);
