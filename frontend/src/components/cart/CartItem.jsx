import { X } from 'lucide-react';
import SmartImage from '../common/SmartImage';
import QuantitySelector from '../common/QuantitySelector';
import useCart from '../../hooks/useCart';
import formatCurrency from '../../utils/formatCurrency';
import { getLineTotal } from '../../utils/cartUtils';

const CartItem = ({ item }) => {
  const { incrementItem, decrementItem, removeItem } = useCart();

  return (
    <li className="flex gap-4 py-4">
      <SmartImage src={item.image} alt={item.name} width="80" height="80" className="h-20 w-20 shrink-0 rounded-2xl" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="truncate font-sans text-[15px] font-semibold text-espresso">{item.name}</h4>
            <p className="text-xs text-espresso/55">{formatCurrency(item.price)} each</p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item._id)}
            className="-mt-1 -mr-1 rounded-full p-1.5 text-espresso/40 transition hover:bg-red-50 hover:text-red-600"
            aria-label={`Remove ${item.name} from cart`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={() => incrementItem(item._id)}
            onDecrease={() => decrementItem(item._id)}
            itemName={item.name}
          />
          <p className="font-semibold text-brown tabular-nums">{formatCurrency(getLineTotal(item))}</p>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
