import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { StatusBadge } from './OrderStatus';
import formatDate from '../../utils/formatDate';
import { ORDER_TYPES } from '../../utils/constants';

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full p-1.5 text-brown/60 transition hover:bg-beige/70 hover:text-brown"
      aria-label={copied ? 'Order number copied' : 'Copy order number'}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
    </button>
  );
};

const DetailItem = ({ label, className = '', children }) => (
  <div className={`rounded-2xl bg-cream/80 px-4 py-3 ${className}`}>
    <dt className="text-[11px] font-semibold tracking-wider text-espresso/45 uppercase">{label}</dt>
    <dd className="mt-1 flex items-center gap-1 text-sm font-semibold text-espresso">{children}</dd>
  </div>
);

const OrderDetails = ({ order }) => {
  const isDineIn = order.orderType === ORDER_TYPES.DINE_IN;

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <DetailItem label="Order number" className="col-span-2 sm:col-span-1">
        <span className="font-mono tracking-wide whitespace-nowrap">{order.orderNumber}</span>
        <CopyButton value={order.orderNumber} />
      </DetailItem>
      <DetailItem label="Status">
        <StatusBadge status={order.status} />
      </DetailItem>
      <DetailItem label="Customer">{order.customerName}</DetailItem>
      <DetailItem label="Order type">
        {isDineIn ? `Dine-in${order.tableNumber ? ` · Table ${order.tableNumber}` : ''}` : 'Takeaway'}
      </DetailItem>
      <DetailItem label="Phone">{order.phone}</DetailItem>
      <DetailItem label="Placed on">{formatDate(order.createdAt)}</DetailItem>
      {order.specialInstructions && (
        <div className="col-span-2 rounded-2xl bg-cream/80 px-4 py-3 sm:col-span-3">
          <dt className="text-[11px] font-semibold tracking-wider text-espresso/45 uppercase">Special instructions</dt>
          <dd className="mt-1 text-sm text-espresso/80">{order.specialInstructions}</dd>
        </div>
      )}
    </dl>
  );
};

export default OrderDetails;
