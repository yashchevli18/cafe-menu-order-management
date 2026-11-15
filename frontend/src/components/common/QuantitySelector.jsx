import { Minus, Plus, Trash2 } from 'lucide-react';
import { MAX_ITEM_QUANTITY } from '../../utils/constants';

const SIZES = {
  sm: { wrapper: 'h-9', button: 'h-9 w-9', icon: 'h-3.5 w-3.5', value: 'w-7 text-sm' },
  md: { wrapper: 'h-11', button: 'h-11 w-11', icon: 'h-4 w-4', value: 'w-8 text-base' },
};

const QuantitySelector = ({
  quantity,
  onIncrease,
  onDecrease,
  max = MAX_ITEM_QUANTITY,
  removeAtMin = false,
  size = 'sm',
  itemName = 'item',
}) => {
  const styles = SIZES[size];
  const showRemove = removeAtMin && quantity <= 1;
  const DecreaseIcon = showRemove ? Trash2 : Minus;
  const buttonClass = `flex items-center justify-center rounded-full text-brown transition hover:bg-beige/70 disabled:cursor-not-allowed disabled:opacity-40 ${styles.button}`;

  return (
    <div
      className={`inline-flex items-center rounded-full border border-beige bg-white shadow-sm ${styles.wrapper}`}
      role="group"
      aria-label={`Quantity of ${itemName}`}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={!removeAtMin && quantity <= 1}
        className={buttonClass}
        aria-label={showRemove ? `Remove ${itemName}` : `Decrease quantity of ${itemName}`}
      >
        <DecreaseIcon className={styles.icon} aria-hidden="true" />
      </button>
      <span className={`text-center font-semibold text-espresso tabular-nums ${styles.value}`} aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className={buttonClass}
        aria-label={`Increase quantity of ${itemName}`}
      >
        <Plus className={styles.icon} aria-hidden="true" />
      </button>
    </div>
  );
};

export default QuantitySelector;
