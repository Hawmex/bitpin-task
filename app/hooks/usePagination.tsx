import { useCallback, useMemo, useState } from "react";

export type UsePaginationProps<T> = {
  data: T[];
  itemsPerPage: number;
  initialPage?: number;
};

export type UsePaginationReturn<T> = {
  currentPageData: T[];
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export function usePagination<T>({
  data,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.ceil(data.length / itemsPerPage),
    [data.length, itemsPerPage],
  );

  const currentPageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return data.slice(start, start + itemsPerPage);
  }, [currentPage, data, itemsPerPage]);

  const goToPage = useCallback(
    (page: number) => {
      const newPage = Math.max(1, Math.min(totalPages, page));

      setCurrentPage(newPage);
    },
    [totalPages],
  );

  const nextPage = useCallback(
    () => goToPage(currentPage + 1),
    [currentPage, goToPage],
  );

  const prevPage = useCallback(
    () => goToPage(currentPage - 1),
    [currentPage, goToPage],
  );

  const hasNextPage = useMemo(
    () => currentPage < totalPages,
    [currentPage, totalPages],
  );

  const hasPrevPage = useMemo(() => currentPage > 1, [currentPage]);

  return {
    currentPageData,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
  };
}
