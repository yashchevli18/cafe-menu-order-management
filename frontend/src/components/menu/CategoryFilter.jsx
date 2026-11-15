import { CATEGORY_FILTERS } from '../../utils/constants';

const CategoryFilter = ({ selected, onSelect }) => (
  <div className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
    <div className="flex w-max gap-2 pb-1" role="radiogroup" aria-label="Filter by category">
      {CATEGORY_FILTERS.map((category) => {
        const isActive = selected === category;
        return (
          <button
            key={category}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(category)}
            className={`h-10 rounded-full px-4.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'bg-espresso text-cream shadow-soft'
                : 'border border-beige bg-white text-espresso/75 hover:border-caramel/60 hover:text-espresso'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  </div>
);

export default CategoryFilter;
