import { ShoppingBag } from 'lucide-react';
import useCart from '../../hooks/useCart';
import formatCurrency from '../../utils/formatCurrency';

const MobileCartBar = () => {
  const { itemCount, total, openCart, isCartOpen } = useCart();
  if (itemCount === 0 || isCartOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 animate-fade-up px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
      <button
        type="button"
        onClick={openCart}
        className="flex h-14 w-full items-center justify-between rounded-full bg-espresso pr-2 pl-5 text-cream shadow-lift transition active:scale-[0.99]"
      >
        <span className="flex items-center gap-2.5 text-sm font-semibold">
          <ShoppingBag className="h-5 w-5 text-caramel" aria-hidden="true" />
          {itemCount} {itemCount === 1 ? 'item' : 'items'} &middot; {formatCurrency(total)}
        </span>
        <span className="rounded-full bg-caramel px-5 py-2.5 text-sm font-semibold text-white">View cart</span>
      </button>
    </div>
  );
};

export default MobileCartBar;
