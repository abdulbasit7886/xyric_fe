import type { FC } from "react";
import type { PaginatedMeta } from "../types/item";

interface PaginationProps {
  meta: PaginatedMeta | null;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const Pagination: FC<PaginationProps> = ({
  meta,
  onPageChange,
  isLoading,
}) => {
  if (!meta) return null;

  const { page, totalPages, total } = meta;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="pagination">
      <div>
        Showing page {page} of {totalPages} • {total} items total
      </div>
      <div className="pagination__controls">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev || isLoading}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext || isLoading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
