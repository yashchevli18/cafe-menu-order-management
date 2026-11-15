import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, ShoppingBag, Trash2, Wallet } from 'lucide-react';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import ErrorMessage from '../components/common/ErrorMessage';
import TableBadge from '../components/common/TableBadge';
import useCart from '../hooks/useCart';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { createOrder } from '../services/orderService';
import { session } from '../utils/storage';
import { ORDER_TYPES, STORAGE_KEYS } from '../utils/constants';

const CHECKOUT_FORM_ID = 'checkout-form';

const buildOrderPayload = (values, items) => {
  const isDineIn = values.orderType === ORDER_TYPES.DINE_IN;
  return {
    customerName: values.customerName.trim(),
    phone: values.phone.trim(),
    orderType: values.orderType,
    tableNumber: isDineIn ? Number(values.tableNumber) : undefined,
    specialInstructions: values.specialInstructions.trim() || undefined,
    items: items.map((item) => ({ menuItem: item._id, quantity: item.quantity })),
  };
};

const CheckoutPage = () => {
  useDocumentTitle('Checkout');
  const { items, subtotal, total, tableNumber, clearCart, removeItem } = useCart();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const isSubmittingRef = useRef(false);

  const handlePlaceOrder = async (values) => {
    if (isSubmittingRef.current) return;
    if (items.length === 0) {
      toast.error('Your cart is empty. Add something delicious first!');
      return;
    }

    isSubmittingRef.current = true;
    setIsPlacingOrder(true);
    setOrderError(null);

    try {
      const order = await createOrder(buildOrderPayload(values, items));
      session.set(STORAGE_KEYS.lastOrder, { order, phone: values.phone.trim() });
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.orderNumber}`, { replace: true, state: { order } });
      clearCart();
    } catch (error) {
      const unavailableIds = error.status === 409 ? error.errors.map((detail) => detail.value).filter(Boolean) : [];
      setOrderError({
        message: error.message,
        details: error.errors.map((detail) => detail.message),
        unavailableIds,
      });
      toast.error(error.message);
      isSubmittingRef.current = false;
      setIsPlacingOrder(false);
    }
  };

  const removeUnavailableItems = () => {
    orderError.unavailableIds.forEach((id) => removeItem(id));
    setOrderError(null);
    toast.success('Unavailable items removed from your cart');
  };

  if (items.length === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add a few favourites from our menu and come back here to place your order."
          action={
            <Button as={Link} to="/menu" leftIcon={ArrowLeft}>
              Browse the menu
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <Link
        to="/menu"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brown transition hover:text-caramel"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to menu
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-4xl font-semibold text-espresso">Checkout</h1>
        <TableBadge tableNumber={tableNumber} />
      </div>
      <p className="mt-2 text-espresso/65">No account needed. Just tell us who you are and how you&apos;d like it.</p>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
        <div className="space-y-6">
          {orderError && (
            <div className="space-y-3">
              <ErrorMessage
                title="We couldn't place your order"
                message={orderError.message}
                details={orderError.details}
              />
              {orderError.unavailableIds.length > 0 && (
                <Button variant="outline" size="sm" leftIcon={Trash2} onClick={removeUnavailableItems}>
                  Remove unavailable items
                </Button>
              )}
            </div>
          )}
          <CheckoutForm formId={CHECKOUT_FORM_ID} tableNumber={tableNumber} onSubmit={handlePlaceOrder} />
        </div>

        <OrderSummary items={items} subtotal={subtotal} total={total} className="lg:sticky lg:top-24">
          <Button
            type="submit"
            form={CHECKOUT_FORM_ID}
            size="lg"
            fullWidth
            isLoading={isPlacingOrder}
            loadingText="Placing your order..."
          >
            Place Order
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-espresso/55">
            <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
            Pay at the counter. No online payment required.
          </p>
        </OrderSummary>
      </div>
    </div>
  );
};

export default CheckoutPage;
