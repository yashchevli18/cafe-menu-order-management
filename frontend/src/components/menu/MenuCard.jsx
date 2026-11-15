import { Plus } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';
import SmartImage from '../common/SmartImage';
import QuantitySelector from '../common/QuantitySelector';
import useCart from '../../hooks/useCart';
import formatCurrency from '../../utils/formatCurrency';

const MenuCard = ({ item }) => {
  const { addItem, getItemQuantity, incrementItem, decrementItem } = useCart();
  const quantity = getItemQuantity(item._id);
  const { isAvailable } = item;

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-beige/70 bg-white shadow-soft transition duration-300 ${
        isAvailable ? 'hover:-translate-y-1 hover:shadow-lift' : ''
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage
          src={item.image}
          alt={item.name}
          width="400"
          height="300"
          className={`h-full w-full transition-transform duration-700 ${
            isAvailable ? 'group-hover:scale-105' : 'grayscale-[60%]'
          }`}
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <Badge variant="light">{item.category}</Badge>
          {isAvailable ? (
            <Badge variant="success" className="bg-white/95">
              Available
            </Badge>
          ) : (
            <Badge variant="danger" className="bg-white/95">
              Sold out
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg leading-snug font-semibold text-espresso">{item.name}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-espresso/60">{item.description}</p>

        <div className="mt-5 flex min-h-11 items-center justify-between gap-3">
          <p className="text-xl font-semibold text-brown tabular-nums">{formatCurrency(item.price)}</p>
          {quantity > 0 ? (
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => incrementItem(item._id)}
              onDecrease={() => decrementItem(item._id)}
              removeAtMin
              itemName={item.name}
            />
          ) : (
            <Button
              size="sm"
              variant={isAvailable ? 'primary' : 'outline'}
              leftIcon={isAvailable ? Plus : undefined}
              disabled={!isAvailable}
              onClick={() => addItem(item)}
              aria-label={isAvailable ? `Add ${item.name} to cart` : `${item.name} is unavailable`}
            >
              {isAvailable ? 'Add to Cart' : 'Unavailable'}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

export default MenuCard;
