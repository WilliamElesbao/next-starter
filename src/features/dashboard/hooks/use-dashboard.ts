"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { OnChangeFn, PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { getDocumentSections } from "@/actions/documents.action";

export function useDashboard() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["document-sections", pagination],
    queryFn: () =>
      getDocumentSections({
        take: pagination.pageSize,
        skip: pagination.pageIndex * pagination.pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  return {
    documents: data?.documents ?? [],
    total: data?.total ?? 0,
    pagination,
    setPagination: setPagination as OnChangeFn<PaginationState>,
    isLoading,
    isFetching,
  };
}
