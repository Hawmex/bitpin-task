import { usePagination } from "~/hooks/usePagination";
import type { BPCurrency } from "~/services/markets";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

export type CurrenciesProps = {
  currencies: BPCurrency[];
};

export function Currencies({ currencies }: CurrenciesProps) {
  const {
    currentPage,
    currentPageData,
    hasNextPage,
    hasPrevPage,
    totalPages,
    nextPage,
    prevPage,
  } = usePagination({ data: currencies, itemsPerPage: 10 });

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <div className="w-full">
        <Pagination>
          <PaginationContent>
            {hasPrevPage && (
              <>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={prevPage} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">{currentPage - 1}</PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationLink isActive href="#">
                {currentPage}
              </PaginationLink>
            </PaginationItem>
            {hasNextPage && (
              <>
                <PaginationItem>
                  <PaginationLink href="#">{currentPage + 1}</PaginationLink>
                </PaginationItem>
                {currentPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext href="#" onClick={nextPage} />
                </PaginationItem>
              </>
            )}
          </PaginationContent>
        </Pagination>
      </div>
      {currentPageData.map(({ code, title_fa, title }) => (
        <Card key={code} className="w-max min-w-24 grow-1">
          <CardHeader>
            <CardTitle>{code}</CardTitle>
            <CardDescription>
              {title_fa} - {title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
