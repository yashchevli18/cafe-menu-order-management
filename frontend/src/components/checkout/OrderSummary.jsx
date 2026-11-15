import SmartImage from '../common/SmartImage';
import CartSummary from '../cart/CartSummary';
import formatCurrency from '../../utils/formatCurrency';
import { getLineTotal } from '../../utils/cartUtils';

const OrderSummary = ({ title = 'Order Summary', items, subtotal, total, header, children, className = '' }) => {
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <section className={`card p-5 sm:p-6 ${className}`} aria-label={title}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-espresso">{title}</h2>
        {header}
      </div>

      <ul className="mt-4 divide-y divide-beige/80">
        {items.map((item) => (
          <li key={item.menuItem ?? item._id} className="flex items-center gap-3.5 py-3.5">
            <SmartImage
              src={item.image}
              alt={item.name}
              width="56"
              height="56"
              className="h-14 w-14 shrink-0 rounded-xl"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-espresso">{item.name}</p>
              <p className="mt-0.5 text-xs text-espresso/55 tabular-nums">
                {formatCurrency(item.price)} &times; {item.quantity}
              </p>
            </div>
            <p className="text-sm font-semibold text-espresso tabular-nums">
              {formatCurrency(item.lineTotal ?? getLineTotal(item))}
            </p>
          </li>
        ))}
      </ul>

      <CartSummary itemCount={itemCount} subtotal={subtotal} total={total} className="mt-2 border-t border-beige pt-4" />

      {children && <div className="mt-5">{children}</div>}
    </section>
  );
};

export default OrderSummary;
