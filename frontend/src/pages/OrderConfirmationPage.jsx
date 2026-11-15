import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Receipt } from 'lucide-react';
import OrderConfirmation from '../components/order/OrderConfirmation';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { session } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';

const resolveOrder = (orderNumber, locationState) => {
  if (locationState?.order?.orderNumber === orderNumber) return locationState.order;
  const lastOrder = session.get(STORAGE_KEYS.lastOrder);
  return lastOrder?.order?.orderNumber === orderNumber ? lastOrder.order : null;
};

const OrderConfirmationPage = () => {
  useDocumentTitle('Order Confirmed');
  const { orderNumber } = useParams();
  const location = useLocation();
  const order = resolveOrder(orderNumber, location.state);

  return (
    <div className="container-page py-10 sm:py-14">
      {order ? (
        <OrderConfirmation order={order} />
      ) : (
        <EmptyState
          icon={Receipt}
          title="Order details not available here"
          description={`For your privacy we only show full order details in the browser session that placed it. You can still check order ${orderNumber} using the phone number you ordered with.`}
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to={`/track-order?orderNumber=${orderNumber}`} leftIcon={MapPin}>
                Track this order
              </Button>
              <Button as={Link} to="/menu" variant="outline" leftIcon={ArrowLeft}>
                Back to menu
              </Button>
            </div>
          }
        />
      )}
    </div>
  );
};

export default OrderConfirmationPage;
