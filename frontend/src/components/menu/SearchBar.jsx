import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search coffee, pizza, desserts...' }) => (
  <div className="relative w-full">
    <Search
      className="pointer-events-none absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-brown/50"
      aria-hidden="true"
    />
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label="Search menu items by name"
      maxLength={60}
      className="h-12 w-full rounded-full border border-beige bg-white pr-11 pl-11 text-[15px] text-espresso shadow-sm transition placeholder:text-espresso/40 focus:border-caramel focus:ring-4 focus:ring-caramel/15 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-espresso/50 transition hover:bg-beige/70 hover:text-espresso"
        aria-label="Clear search"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    )}
  </div>
);

export default SearchBar;
