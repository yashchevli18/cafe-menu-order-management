import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { QrCode, SearchX, UtensilsCrossed } from 'lucide-react';
import SearchBar from '../components/menu/SearchBar';
import CategoryFilter from '../components/menu/CategoryFilter';
import PriceSort from '../components/menu/PriceSort';
import MenuList from '../components/menu/MenuList';
import MobileCartBar from '../components/cart/MobileCartBar';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import TableBadge from '../components/common/TableBadge';
import Button from '../components/common/Button';
import useCart from '../hooks/useCart';
import useDebounce from '../hooks/useDebounce';
import useMenuItems from '../hooks/useMenuItems';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { CATEGORY_FILTERS, MENU_PAGE_SIZE, SORT_OPTIONS } from '../utils/constants';

const resolveCategory = (value) =>
  CATEGORY_FILTERS.find((category) => category.toLowerCase() === (value ?? '').toLowerCase()) ?? 'All';

const resolveSort = (value) => (SORT_OPTIONS.some((option) => option.value === value) ? value : 'default');

const MenuPage = () => {
  useDocumentTitle('Menu');
  const { tableNumber } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const listTopRef = useRef(null);

  const category = resolveCategory(searchParams.get('category'));
  const sort = resolveSort(searchParams.get('sort'));
  const page = Math.max(1, Number.parseInt(searchParams.get('page'), 10) || 1);
  const searchQuery = searchParams.get('q') ?? '';

  const [searchInput, setSearchInput] = useState(searchQuery);
  const debouncedSearch = useDebounce(searchInput.trim());

  const updateParams = useCallback(
    (updates) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') next.delete(key);
            else next.set(key, String(value));
          });
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const syncedSearchRef = useRef(searchQuery);

  useEffect(() => {
    if (debouncedSearch === syncedSearchRef.current) return;
    syncedSearchRef.current = debouncedSearch;
    updateParams({ q: debouncedSearch, page: null });
  }, [debouncedSearch, updateParams]);

  useEffect(() => {
    if (searchQuery === syncedSearchRef.current) return;
    syncedSearchRef.current = searchQuery;
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const queryParams = useMemo(
    () => ({
      search: searchQuery || undefined,
      category: category === 'All' ? undefined : category,
      sort,
      page,
      limit: MENU_PAGE_SIZE,
    }),
    [searchQuery, category, sort, page],
  );

  const { items, pagination, loading, error, refetch } = useMenuItems(queryParams);
  const hasActiveFilters = Boolean(searchQuery) || category !== 'All';

  const clearFilters = () => {
    setSearchInput('');
    syncedSearchRef.current = '';
    updateParams({ q: null, category: null, page: null });
  };

  const handlePageChange = (nextPage) => {
    updateParams({ page: nextPage > 1 ? nextPage : null });
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const emptyState = hasActiveFilters ? (
    <EmptyState
      icon={SearchX}
      title="No matching items"
      description={
        searchQuery
          ? `We couldn't find anything matching "${searchQuery}"${category !== 'All' ? ` in ${category}` : ''}. Try a different search or category.`
          : `There are no items in ${category} right now. Try another category.`
      }
      action={
        <Button variant="outline" onClick={clearFilters}>
          Clear filters
        </Button>
      }
    />
  ) : (
    <EmptyState
      icon={UtensilsCrossed}
      title="Our menu is being prepared"
      description="We're updating our menu right now. Please check back in a few minutes."
    />
  );

  return (
    <div className="pb-24 md:pb-16">
      <section className="border-b border-beige/70 bg-beige-light">
        <div className="container-page py-10 sm:py-14">
          <p className="section-eyebrow">Fresh from our kitchen</p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-espresso sm:text-5xl">Our Menu</h1>
              <p className="mt-3 max-w-xl text-espresso/65">
                Hand-crafted coffee, slow-steeped teas and comfort food made to order. Prices are in INR and
                include taxes.
              </p>
            </div>
            {tableNumber ? (
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-soft">
                <TableBadge tableNumber={tableNumber} />
                <p className="text-sm text-espresso/70">We&apos;ll serve your order at your table.</p>
              </div>
            ) : (
              <p className="flex items-center gap-2 text-sm text-espresso/60">
                <QrCode className="h-4 w-4 text-caramel" aria-hidden="true" />
                Dining in? Scan the QR code on your table.
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b border-beige/70 bg-cream/95 backdrop-blur-lg sm:top-18">
        <div className="container-page space-y-3 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchBar value={searchInput} onChange={setSearchInput} />
            <PriceSort value={sort} onChange={(value) => updateParams({ sort: value === 'default' ? null : value, page: null })} />
          </div>
          <CategoryFilter
            selected={category}
            onSelect={(value) => updateParams({ category: value === 'All' ? null : value, page: null })}
          />
        </div>
      </div>

      <section ref={listTopRef} className="container-page scroll-mt-48 pt-8" aria-live="polite">
        {!loading && !error && pagination && pagination.total > 0 && (
          <div className="mb-5 flex items-center justify-between gap-3 text-sm text-espresso/60">
            <p>
              Showing <span className="font-semibold text-espresso">{items.length}</span> of{' '}
              <span className="font-semibold text-espresso">{pagination.total}</span>{' '}
              {pagination.total === 1 ? 'item' : 'items'}
              {category !== 'All' && <> in {category}</>}
              {searchQuery && <> for &ldquo;{searchQuery}&rdquo;</>}
            </p>
            {hasActiveFilters && (
              <button type="button" onClick={clearFilters} className="font-medium text-brown hover:text-caramel">
                Clear filters
              </button>
            )}
          </div>
        )}

        <MenuList items={items} loading={loading} error={error} onRetry={refetch} emptyState={emptyState} />
        {!loading && !error && <Pagination pagination={pagination} onPageChange={handlePageChange} />}
      </section>

      <MobileCartBar />
    </div>
  );
};

export default MenuPage;
