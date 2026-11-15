import MenuCard from './MenuCard';
import ErrorMessage from '../common/ErrorMessage';

const GRID_CLASS = 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6';

const MenuCardSkeleton = () => (
  <div className="overflow-hidden rounded-3xl border border-beige/70 bg-white" aria-hidden="true">
    <div className="aspect-[4/3] animate-pulse bg-beige/60" />
    <div className="space-y-3 p-5">
      <div className="h-5 w-2/3 animate-pulse rounded-full bg-beige/70" />
      <div className="h-3.5 w-full animate-pulse rounded-full bg-beige/50" />
      <div className="h-3.5 w-4/5 animate-pulse rounded-full bg-beige/50" />
      <div className="flex items-center justify-between pt-3">
        <div className="h-6 w-16 animate-pulse rounded-full bg-beige/70" />
        <div className="h-9 w-28 animate-pulse rounded-full bg-beige/70" />
      </div>
    </div>
  </div>
);

const MenuList = ({ items, loading, error, onRetry, emptyState, skeletonCount = 8 }) => {
  if (loading) {
    return (
      <div className={GRID_CLASS} role="status" aria-label="Loading menu items">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <MenuCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorMessage title="We couldn't load the menu" message={error} onRetry={onRetry} />;
  }

  if (!items.length) return emptyState;

  return (
    <div className={GRID_CLASS}>
      {items.map((item, index) => (
        <div key={item._id} className="animate-fade-up" style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
          <MenuCard item={item} />
        </div>
      ))}
    </div>
  );
};

export default MenuList;
