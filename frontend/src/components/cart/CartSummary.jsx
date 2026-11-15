import formatCurrency from '../../utils/formatCurrency';

const CartSummary = ({ itemCount, subtotal, total, className = '' }) => (
  <dl className={`space-y-2 text-sm ${className}`}>
    <div className="flex justify-between text-espresso/70">
      <dt>
        Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
      </dt>
      <dd className="tabular-nums">{formatCurrency(subtotal)}</dd>
    </div>
    <div className="flex justify-between text-espresso/70">
      <dt>Taxes &amp; charges</dt>
      <dd>Included</dd>
    </div>
    <div className="flex justify-between border-t border-dashed border-beige pt-3 text-base font-semibold text-espresso">
      <dt>Total</dt>
      <dd className="text-lg text-brown tabular-nums">{formatCurrency(total)}</dd>
    </div>
  </dl>
);

export default CartSummary;
