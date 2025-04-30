import { useCallback, useMemo } from "react";

export type UsePaginationProps<T> = {
  data: T[];
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (currentPage: number) => void;
};

export type UsePaginationReturn<T> = {
  currentPageData: T[];
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export function usePagination<T>({
  data,
  itemsPerPage,
  currentPage,
  onPageChange,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
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

      onPageChange(newPage);
    },
    [onPageChange, totalPages],
  );

  const nextPage = useCallback(
    () => goToPage(currentPage + 1),
    [currentPage, goToPage],
  );

  const prevPage = useCallback(
    () => goToPage(currentPage - 1),
    [currentPage, goToPage],
  );

  const firstPage = useCallback(() => goToPage(1), [goToPage]);

  const lastPage = useCallback(
    () => goToPage(totalPages),
    [goToPage, totalPages],
  );

  const hasNextPage = useMemo(
    () => currentPage < totalPages,
    [currentPage, totalPages],
  );

  const hasPrevPage = useMemo(() => currentPage > 1, [currentPage]);

  return {
    currentPageData,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    hasNextPage,
    hasPrevPage,
  };
}
