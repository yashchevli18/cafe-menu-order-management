import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, hasPrevPage, hasNextPage } = pagination;

  return (
    <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Menu pages">
      <Button
        variant="outline"
        size="sm"
        leftIcon={ChevronLeft}
        disabled={!hasPrevPage}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="px-2 text-sm font-medium text-espresso/70">
        Page <span className="text-espresso">{page}</span> of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        rightIcon={ChevronRight}
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
};

export default Pagination;
