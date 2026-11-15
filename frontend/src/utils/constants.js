export const MENU_CATEGORIES = ['Coffee', 'Tea', 'Cold Drinks', 'Pizza', 'Burgers', 'Sandwiches', 'Desserts'];

export const CATEGORY_FILTERS = ['All', ...MENU_CATEGORIES];

export const SORT_OPTIONS = [
  { value: 'default', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export const MENU_PAGE_SIZE = 12;

export const ORDER_TYPES = {
  DINE_IN: 'dine-in',
  TAKEAWAY: 'takeaway',
};

export const ORDER_STATUS_FLOW = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed'];

export const ORDER_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  READY: 'Ready',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const TABLE_LIMITS = { min: 1, max: 100 };

export const MAX_ITEM_QUANTITY = 20;

export const MAX_INSTRUCTIONS_LENGTH = 300;

export const INDIAN_MOBILE_REGEX = /^(?:\+?91|0)?[6-9]\d{9}$/;

export const ORDER_NUMBER_REGEX = /^BB-\d{6}-[A-Z0-9]{5}$/;

/* global __DEV_LAN_ORIGIN__ */
export const DEV_LAN_ORIGIN = __DEV_LAN_ORIGIN__;

export const STORAGE_KEYS = {
  cart: 'brew-bean:cart',
  table: 'brew-bean:table',
  lastOrder: 'brew-bean:last-order',
};

export const CAFE_INFO = {
  name: 'Brew & Bean',
  tagline: 'Specialty coffee & kitchen',
  address: 'Shop No. G-12, Ground Floor, Ambrosia Business Hub, VIP Road, Vesu, Surat, Gujarat 395007',
  phone: '+91 9724999990',
  email: 'brewbean@gmail.com',
  hours: [
    { days: 'Mon – Fri', time: '7:30 AM – 11:00 PM' },
    { days: 'Sat – Sun', time: '8:00 AM – 11:30 PM' },
  ],
  socials: {
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
    x: 'https://x.com/',
  },
};
