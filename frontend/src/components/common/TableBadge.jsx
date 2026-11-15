import { Armchair } from 'lucide-react';

const TableBadge = ({ tableNumber, className = '' }) => {
  if (!tableNumber) return null;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full whitespace-nowrap bg-caramel/15 px-3 py-1.5 text-xs font-semibold text-caramel-dark ring-1 ring-caramel/30 ${className}`}
    >
      <Armchair className="h-3.5 w-3.5" aria-hidden="true" />
      Table {tableNumber}
    </span>
  );
};

export default TableBadge;
