"use server";

import type { DataTableItem } from "@/components/data-table";
import { db } from "@/database/prisma-connection";
import { toTitleCase } from "@/utils/to-title-case";

interface GetDocumentSectionsParams {
  take?: number;
  skip?: number;
}

interface GetDocumentSectionsResult {
  documents: DataTableItem[];
  total: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export async function getDocumentSections({
  take,
  skip,
}: GetDocumentSectionsParams = {}): Promise<GetDocumentSectionsResult> {
  const pageSize = take ?? 10;
  const offset = skip ?? 0;

  const [documents, total] = await db.$transaction([
    db.documentSection.findMany({
      take: pageSize,
      skip: offset,
      orderBy: { id: "asc" },
    }),
    db.documentSection.count(),
  ]);

  const normalizedDocuments = documents.map((document) => ({
    id: document.id,
    header: document.header,
    type: toTitleCase(document.type),
    status: toTitleCase(document.status),
    target: document.target.toString(),
    limit: document.limit.toString(),
    reviewer: document.reviewer ?? "Assign reviewer",
  }));

  const currentPage = Math.floor(offset / pageSize) + 1; // 1-based
  const totalPages = Math.ceil(total / pageSize);

  return {
    documents: normalizedDocuments,
    total,
    pageSize,
    currentPage,
    totalPages,
  };
}
