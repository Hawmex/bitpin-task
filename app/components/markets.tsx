import { useCallback } from "react";
import { useNavigate } from "react-router";
import { usePagination, type UsePaginationProps } from "~/hooks";
import { numFormatter, type GroupedBPMarkets } from "~/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export type MarketsProps = Pick<
  UsePaginationProps<unknown>,
  "currentPage" | "onPageChange"
> & { markets: GroupedBPMarkets["markets"] };

export function Markets({ markets, currentPage, onPageChange }: MarketsProps) {
  const navigate = useNavigate();

  const {
    currentPageData,
    hasNextPage,
    hasPrevPage,
    totalPages,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  } = usePagination({
    data: markets,
    itemsPerPage: 10,
    currentPage,
    onPageChange,
  });

  const handleClick = useCallback(
    (id: number) => () => navigate(`${id}`),
    [navigate],
  );

  return (
    <Table className="select-none">
      <TableHeader>
        <TableRow>
          <TableHead className="w-xs">نماد</TableHead>
          <TableHead className="w-2xs">نام</TableHead>
          <TableHead className="w-3xs">قیمت</TableHead>
          <TableHead className="w-3xs">حجم بازار</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentPageData.map(({ details, currency }) => (
          <TableRow key={details.code} onClick={handleClick(details.id)}>
            <TableCell className="font-medium">
              <div className="flex flex-row gap-2 items-center">
                <img className="w-6 h-6" src={currency.image} />
                <span>{currency.code}</span>
              </div>
            </TableCell>
            <TableCell>{currency.title_fa}</TableCell>
            <TableCell>{numFormatter.format(Number(details.price))}</TableCell>
            <TableCell>
              {numFormatter.format(Number(details.market_cap))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>
            <Pagination>
              <PaginationContent>
                <PaginationItem disabled={!hasPrevPage}>
                  <PaginationFirst onClick={firstPage} />
                </PaginationItem>
                <PaginationItem disabled={!hasPrevPage}>
                  <PaginationPrevious onClick={prevPage} />
                </PaginationItem>
                <PaginationItem className="px-2.5">
                  {currentPage} از {totalPages}
                </PaginationItem>
                <PaginationItem disabled={!hasNextPage}>
                  <PaginationNext onClick={nextPage} />
                </PaginationItem>
                <PaginationItem disabled={!hasNextPage}>
                  <PaginationLast onClick={lastPage} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
