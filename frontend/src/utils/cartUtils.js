import { MAX_ITEM_QUANTITY, TABLE_LIMITS } from './constants';

const roundCurrency = (value) => Math.round(value * 100) / 100;

export const getLineTotal = (item) => roundCurrency(item.price * item.quantity);

export const calculateCartTotals = (items) => {
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = roundCurrency(items.reduce((sum, item) => sum + getLineTotal(item), 0));
  return { itemCount, subtotal, total: subtotal };
};

export const clampQuantity = (quantity) =>
  Math.min(MAX_ITEM_QUANTITY, Math.max(1, Math.trunc(Number(quantity) || 1)));

export const parseTableNumber = (value) => {
  if (value === null || value === undefined || String(value).trim() === '') return null;
  const tableNumber = Number(value);
  const isValid =
    Number.isInteger(tableNumber) && tableNumber >= TABLE_LIMITS.min && tableNumber <= TABLE_LIMITS.max;
  return isValid ? tableNumber : null;
};

const isValidCartItem = (item) =>
  item &&
  typeof item._id === 'string' &&
  typeof item.name === 'string' &&
  Number.isFinite(item.price) &&
  Number.isInteger(item.quantity) &&
  item.quantity > 0;

export const sanitizeStoredCart = (value) =>
  Array.isArray(value)
    ? value.filter(isValidCartItem).map((item) => ({ ...item, quantity: clampQuantity(item.quantity) }))
    : [];
