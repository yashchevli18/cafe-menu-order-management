import { Link } from 'react-router-dom';
import { ArrowLeft, CircleCheck, MapPin } from 'lucide-react';
import Button from '../common/Button';
import OrderDetails from './OrderDetails';
import OrderStatus from './OrderStatus';
import OrderSummary from '../checkout/OrderSummary';

const OrderConfirmation = ({ order }) => (
  <div className="mx-auto max-w-3xl animate-fade-up">
    <div className="text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
        <CircleCheck className="h-10 w-10 text-emerald-600" aria-hidden="true" />
      </div>
      <p className="section-eyebrow mt-6">Order placed</p>
      <h1 className="mt-2 text-3xl font-semibold text-espresso sm:text-4xl">
        Thank you, {order.customerName.split(' ')[0]}!
      </h1>
      <p className="mx-auto mt-3 max-w-md text-espresso/65">
        {order.tableNumber
          ? `Your order has been sent to our team. We'll bring it to Table ${order.tableNumber}.`
          : "Your order has been sent to our team. We'll call your name at the counter when it's ready."}
      </p>
    </div>

    <section className="card mt-8 space-y-6 p-5 sm:p-7">
      <OrderDetails order={order} />
      <div className="border-t border-beige pt-6">
        <OrderStatus status={order.status} />
      </div>
    </section>

    <OrderSummary
      title="What you ordered"
      items={order.items}
      subtotal={order.subtotal}
      total={order.totalAmount}
      className="mt-6"
    />

    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Button as={Link} to={`/track-order?orderNumber=${order.orderNumber}`} size="lg" leftIcon={MapPin}>
        Track your order
      </Button>
      <Button as={Link} to="/menu" variant="outline" size="lg" leftIcon={ArrowLeft}>
        Back to menu
      </Button>
    </div>
  </div>
);

export default OrderConfirmation;
