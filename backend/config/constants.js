export const MENU_CATEGORIES = [
  'Coffee',
  'Tea',
  'Cold Drinks',
  'Pizza',
  'Burgers',
  'Sandwiches',
  'Desserts',
];

export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

export const FINAL_ORDER_STATUSES = ['Completed', 'Cancelled'];

export const ORDER_TYPES = ['dine-in', 'takeaway'];

export const MENU_SORT_OPTIONS = {
  default: { isAvailable: -1, isFeatured: -1, name: 1 },
  price_asc: { price: 1, name: 1 },
  price_desc: { price: -1, name: 1 },
  newest: { createdAt: -1 },
};

export const LIMITS = {
  minTableNumber: 1,
  maxTableNumber: 100,
  maxItemQuantity: 20,
  maxOrderLines: 30,
  maxPageSize: 100,
  defaultPageSize: 12,
  maxSpecialInstructions: 300,
};

export const INDIAN_MOBILE_REGEX = /^(?:\+?91|0)?[6-9]\d{9}$/;
