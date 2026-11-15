import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import TrackOrderForm from '../components/order/TrackOrderForm';
import OrderDetails from '../components/order/OrderDetails';
import OrderStatus from '../components/order/OrderStatus';
import OrderSummary from '../components/checkout/OrderSummary';
import ErrorMessage from '../components/common/ErrorMessage';
import Button from '../components/common/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { trackOrder } from '../services/orderService';
import { session } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';

const getInitialValues = (orderNumberParam) => {
  const orderNumber = (orderNumberParam ?? '').trim().toUpperCase();
  const lastOrder = session.get(STORAGE_KEYS.lastOrder);
  const phone = orderNumber && lastOrder?.order?.orderNumber === orderNumber ? lastOrder.phone : '';
  return { orderNumber, phone: phone ?? '' };
};

const OrderTrackingPage = () => {
  useDocumentTitle('Track Order');
  const [searchParams] = useSearchParams();
  const [initialValues] = useState(() => getInitialValues(searchParams.get('orderNumber')));
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastQueryRef = useRef(null);
  const resultRef = useRef(null);

  const handleTrack = useCallback(async ({ orderNumber, phone }) => {
    setError(null);
    try {
      const result = await trackOrder(orderNumber, phone);
      lastQueryRef.current = { orderNumber, phone };
      setOrder(result);
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (requestError) {
      setOrder(null);
      setError(requestError.message);
    }
  }, []);

  const handleRefresh = async () => {
    if (!lastQueryRef.current) return;
    setIsRefreshing(true);
    try {
      const result = await trackOrder(lastQueryRef.current.orderNumber, lastQueryRef.current.phone);
      setOrder(result);
      setError(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (initialValues.orderNumber && initialValues.phone) handleTrack(initialValues);
  }, [initialValues, handleTrack]);

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="section-eyebrow">Order tracking</p>
          <h1 className="mt-2 text-4xl font-semibold text-espresso sm:text-5xl">Where&apos;s my order?</h1>
          <p className="mx-auto mt-3 max-w-lg text-espresso/65">
            Enter your order number and the mobile number you used while ordering. We verify both to keep your
            order private.
          </p>
        </div>

        <div className="mt-8">
          <TrackOrderForm initialValues={initialValues} onSubmit={handleTrack} />
        </div>

        {error && <ErrorMessage className="mt-6" title="Order not found" message={error} />}

        {order && (
          <div ref={resultRef} className="mt-8 scroll-mt-24 animate-fade-up space-y-6">
            <section className="card space-y-6 p-5 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-espresso">Order status</h2>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={RefreshCw}
                  isLoading={isRefreshing}
                  onClick={handleRefresh}
                >
                  Refresh
                </Button>
              </div>
              <OrderStatus status={order.status} />
              <div className="border-t border-beige pt-6">
                <OrderDetails order={order} />
              </div>
            </section>
            <OrderSummary title="Order items" items={order.items} subtotal={order.subtotal} total={order.totalAmount} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
