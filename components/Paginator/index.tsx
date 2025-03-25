import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationNumber,
  PaginationPrevious,
} from "@govtechmy/myds-react/pagination";
import { usePagination } from "@govtechmy/myds-react/hooks";
import { cn } from "@lib/helpers";

export default function Paginator({
  count,
  currentPage,
  limit,
  onPageChange,
}: {
  count: number;
  currentPage: number;
  limit: number;
  onPageChange: (page: number) => void;
}) {
  const { max, visiblePages } = usePagination({
    count,
    limit,
    page: currentPage,
  });

  return (
    <Pagination
      page={currentPage}
      onPageChange={onPageChange}
      count={count}
      limit={limit}
      type="default"
      className="sm:justify-end"
    >
      <PaginationContent className="max-sm:gap-0">
        <PaginationItem>
          <PaginationPrevious
            className="p-1.5 max-sm:size-9 sm:p-2"
            disabled={currentPage === 1}
          />
        </PaginationItem>

        {visiblePages?.map(page => (
          <PaginationItem key={page} className="max-sm:*:size-9">
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              typeof page === "number" && (
                <PaginationNumber
                  number={page}
                  className={cn(
                    "size-10 items-center justify-center",
                    page === currentPage
                      ? "bg-[#DDD6B0] text-black hover:bg-[#DDD6B0]/75"
                      : ""
                  )}
                />
              )
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            className="p-1.5 max-sm:size-9 sm:p-2"
            disabled={currentPage === max}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
