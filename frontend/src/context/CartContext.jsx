import { createContext, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import toast from 'react-hot-toast';
import { local, session } from '../utils/storage';
import { MAX_ITEM_QUANTITY, STORAGE_KEYS } from '../utils/constants';
import { calculateCartTotals, clampQuantity, parseTableNumber, sanitizeStoredCart } from '../utils/cartUtils';

export const CartContext = createContext(null);

const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  SET_QUANTITY: 'SET_QUANTITY',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  REPLACE_ITEMS: 'REPLACE_ITEMS',
  SET_TABLE: 'SET_TABLE',
};

const loadInitialState = () => ({
  items: sanitizeStoredCart(local.get(STORAGE_KEYS.cart, [])),
  tableNumber: parseTableNumber(session.get(STORAGE_KEYS.table)),
});

const toCartItem = ({ _id, name, price, image, category }, quantity) => ({
  _id,
  name,
  price,
  image,
  category,
  quantity,
});

const cartReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const { menuItem, quantity } = action.payload;
      const existing = state.items.find((item) => item._id === menuItem._id);
      const items = existing
        ? state.items.map((item) =>
            item._id === menuItem._id ? { ...item, quantity: clampQuantity(item.quantity + quantity) } : item,
          )
        : [...state.items, toCartItem(menuItem, clampQuantity(quantity))];
      return { ...state, items };
    }
    case ACTIONS.SET_QUANTITY: {
      const { id, quantity } = action.payload;
      if (quantity < 1) return { ...state, items: state.items.filter((item) => item._id !== id) };
      return {
        ...state,
        items: state.items.map((item) => (item._id === id ? { ...item, quantity: clampQuantity(quantity) } : item)),
      };
    }
    case ACTIONS.REMOVE_ITEM:
      return { ...state, items: state.items.filter((item) => item._id !== action.payload.id) };
    case ACTIONS.CLEAR_CART:
      return { ...state, items: [] };
    case ACTIONS.REPLACE_ITEMS:
      return { ...state, items: action.payload.items };
    case ACTIONS.SET_TABLE:
      return { ...state, tableNumber: action.payload.tableNumber };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    local.set(STORAGE_KEYS.cart, state.items);
  }, [state.items]);

  useEffect(() => {
    if (state.tableNumber) session.set(STORAGE_KEYS.table, state.tableNumber);
    else session.remove(STORAGE_KEYS.table);
  }, [state.tableNumber]);

  useEffect(() => {
    const syncAcrossTabs = (event) => {
      if (event.key !== STORAGE_KEYS.cart) return;
      const items = sanitizeStoredCart(local.get(STORAGE_KEYS.cart, []));
      dispatch({ type: ACTIONS.REPLACE_ITEMS, payload: { items } });
    };
    window.addEventListener('storage', syncAcrossTabs);
    return () => window.removeEventListener('storage', syncAcrossTabs);
  }, []);

  const getItemQuantity = useCallback(
    (id) => state.items.find((item) => item._id === id)?.quantity ?? 0,
    [state.items],
  );

  const addItem = useCallback(
    (menuItem, quantity = 1) => {
      if (!menuItem?.isAvailable) {
        toast.error(`${menuItem?.name ?? 'This item'} is currently unavailable`);
        return false;
      }
      if (getItemQuantity(menuItem._id) + quantity > MAX_ITEM_QUANTITY) {
        toast.error(`You can add up to ${MAX_ITEM_QUANTITY} of each item`);
        return false;
      }
      dispatch({ type: ACTIONS.ADD_ITEM, payload: { menuItem, quantity } });
      toast.success(`${menuItem.name} added to your order`, { id: `added-${menuItem._id}` });
      return true;
    },
    [getItemQuantity],
  );

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: ACTIONS.SET_QUANTITY, payload: { id, quantity } });
  }, []);

  const incrementItem = useCallback(
    (id) => updateQuantity(id, getItemQuantity(id) + 1),
    [getItemQuantity, updateQuantity],
  );

  const decrementItem = useCallback(
    (id) => updateQuantity(id, getItemQuantity(id) - 1),
    [getItemQuantity, updateQuantity],
  );

  const removeItem = useCallback((id) => dispatch({ type: ACTIONS.REMOVE_ITEM, payload: { id } }), []);

  const clearCart = useCallback(() => dispatch({ type: ACTIONS.CLEAR_CART }), []);

  const setTableNumber = useCallback((value) => {
    dispatch({ type: ACTIONS.SET_TABLE, payload: { tableNumber: parseTableNumber(value) } });
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const totals = useMemo(() => calculateCartTotals(state.items), [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      tableNumber: state.tableNumber,
      ...totals,
      isCartOpen,
      addItem,
      incrementItem,
      decrementItem,
      updateQuantity,
      removeItem,
      clearCart,
      getItemQuantity,
      setTableNumber,
      openCart,
      closeCart,
    }),
    [
      state.items,
      state.tableNumber,
      totals,
      isCartOpen,
      addItem,
      incrementItem,
      decrementItem,
      updateQuantity,
      removeItem,
      clearCart,
      getItemQuantity,
      setTableNumber,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
