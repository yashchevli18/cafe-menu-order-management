import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { SORT_OPTIONS } from '../../utils/constants';

const PriceSort = ({ value, onChange }) => (
  <div className="relative w-full sm:w-60">
    <ArrowUpDown
      className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-brown/60"
      aria-hidden="true"
    />
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Sort menu items by price"
      className="h-12 w-full cursor-pointer appearance-none rounded-full border border-beige bg-white pr-10 pl-10 text-sm font-medium text-espresso shadow-sm transition focus:border-caramel focus:ring-4 focus:ring-caramel/15 focus:outline-none"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown
      className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-brown/60"
      aria-hidden="true"
    />
  </div>
);

export default PriceSort;
