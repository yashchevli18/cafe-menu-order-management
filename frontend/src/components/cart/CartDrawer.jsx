import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Trash2, X } from 'lucide-react';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import Button from '../common/Button';
import Modal from '../common/Modal';
import EmptyState from '../common/EmptyState';
import TableBadge from '../common/TableBadge';
import useCart from '../../hooks/useCart';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';

const CartDrawer = () => {
  const { items, itemCount, subtotal, total, tableNumber, isCartOpen, closeCart, clearCart } = useCart();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();
  useLockBodyScroll(isCartOpen);

  useEffect(() => {
    if (!isCartOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isConfirmOpen) closeCart();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, isConfirmOpen, closeCart]);

  if (!isCartOpen) return null;

  const goTo = (path) => {
    closeCart();
    navigate(path);
  };

  const handleClearCart = () => {
    clearCart();
    setIsConfirmOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 print:hidden">
      <div className="absolute inset-0 animate-fade-in bg-espresso/45 backdrop-blur-[2px]" onClick={closeCart} />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className="absolute inset-y-0 right-0 flex w-full max-w-md animate-slide-in-right flex-col bg-cream shadow-lift"
      >
        <header className="flex items-center justify-between border-b border-beige px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-2xl font-semibold text-espresso">Your Order</h2>
            <div className="mt-1 flex items-center gap-2 text-sm text-espresso/60">
              <span>
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
              <TableBadge tableNumber={tableNumber} className="py-1" />
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full p-2.5 text-espresso/60 transition hover:bg-beige/70 hover:text-espresso"
            aria-label="Close cart"
            autoFocus
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Looks like you haven't added anything yet. Our baristas are ready when you are."
              action={
                <Button onClick={() => goTo('/menu')} rightIcon={ArrowRight}>
                  Browse the menu
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-beige overflow-y-auto px-5 sm:px-6">
              {items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </ul>

            <footer className="border-t border-beige bg-white px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">
              <CartSummary itemCount={itemCount} subtotal={subtotal} total={total} />
              <Button fullWidth size="lg" className="mt-4" rightIcon={ArrowRight} onClick={() => goTo('/checkout')}>
                Proceed to Checkout
              </Button>
              <div className="mt-2 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => goTo('/menu')}>
                  Add more items
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={Trash2}
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  Clear cart
                </Button>
              </div>
            </footer>
          </>
        )}
      </aside>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Clear your cart?"
        description="This will remove all items from your order. You can't undo this."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Keep items
            </Button>
            <Button variant="danger" leftIcon={Trash2} onClick={handleClearCart}>
              Clear cart
            </Button>
          </>
        }
      />
    </div>
  );
};

export default CartDrawer;
