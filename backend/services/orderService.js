import Order from '../models/Order.js';
import ApiError from '../utils/ApiError.js';
import generateOrderNumber from '../utils/generateOrderNumber.js';
import { buildPagination } from '../utils/apiResponse.js';
import { maskPhone } from '../utils/phone.js';
import { getMenuItemsByIds } from './menuService.js';
import { FINAL_ORDER_STATUSES, LIMITS } from '../config/constants.js';

const MAX_ORDER_NUMBER_ATTEMPTS = 5;

const roundCurrency = (value) => Math.round(value * 100) / 100;

const mergeOrderLines = (items) => {
  const quantities = new Map();
  for (const { menuItem, quantity } of items) {
    quantities.set(menuItem, (quantities.get(menuItem) || 0) + quantity);
  }
  return [...quantities.entries()].map(([menuItem, quantity]) => ({ menuItem, quantity }));
};

const buildOrderItems = async (requestedItems) => {
  const lines = mergeOrderLines(requestedItems);
  const menuItems = await getMenuItemsByIds(lines.map((line) => line.menuItem));
  const menuById = new Map(menuItems.map((item) => [String(item._id), item]));

  const errors = [];
  const orderItems = [];

  lines.forEach((line) => {
    const menuItem = menuById.get(line.menuItem);

    if (!menuItem) {
      errors.push({ field: 'items', value: line.menuItem, message: 'Menu item no longer exists' });
      return;
    }
    if (!menuItem.isAvailable) {
      errors.push({ field: 'items', value: line.menuItem, message: `${menuItem.name} is currently unavailable` });
      return;
    }
    if (line.quantity > LIMITS.maxItemQuantity) {
      errors.push({
        field: 'items',
        value: line.menuItem,
        message: `You can order at most ${LIMITS.maxItemQuantity} of ${menuItem.name}`,
      });
      return;
    }

    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: line.quantity,
      image: menuItem.image,
    });
  });

  if (errors.length) {
    throw ApiError.conflict('Some items in your order cannot be fulfilled', errors);
  }

  return orderItems;
};

export const calculateOrderTotals = (items) => {
  const subtotal = roundCurrency(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  return { subtotal, totalAmount: subtotal };
};

const isDuplicateOrderNumber = (error) => error?.code === 11000 && error?.keyPattern?.orderNumber;

export const createOrder = async ({ customerName, phone, orderType, tableNumber, specialInstructions, items }) => {
  const orderItems = await buildOrderItems(items);
  const totals = calculateOrderTotals(orderItems);

  const payload = {
    customerName,
    phone,
    orderType,
    tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
    specialInstructions,
    items: orderItems,
    ...totals,
  };

  for (let attempt = 1; attempt <= MAX_ORDER_NUMBER_ATTEMPTS; attempt += 1) {
    try {
      const order = await Order.create({ ...payload, orderNumber: generateOrderNumber() });
      return order.toObject();
    } catch (error) {
      if (!isDuplicateOrderNumber(error) || attempt === MAX_ORDER_NUMBER_ATTEMPTS) throw error;
    }
  }

  throw new ApiError(500, 'Unable to generate a unique order number');
};

export const getOrders = async ({ status, page = 1, limit = LIMITS.defaultPageSize } = {}) => {
  const filter = status ? { status } : {};
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);

  return { orders, pagination: buildPagination({ page, limit, total }) };
};

export const getOrderById = async (id) => {
  const order = await Order.findById(id).lean();
  if (!order) throw ApiError.notFound('Order not found');
  return order;
};

export const trackOrder = async ({ orderNumber, phone }) => {
  const order = await Order.findOne({ orderNumber, phone }).lean();
  if (!order) throw ApiError.notFound('No order matches this order number and phone number');
  return order;
};

export const updateOrderStatus = async (id, status) => {
  const order = await Order.findById(id);
  if (!order) throw ApiError.notFound('Order not found');

  if (FINAL_ORDER_STATUSES.includes(order.status) && order.status !== status) {
    throw ApiError.conflict(`Order is already ${order.status} and can no longer be updated`);
  }

  order.status = status;
  await order.save();
  return order.toObject();
};

export const toPublicOrder = (order) => ({
  orderNumber: order.orderNumber,
  customerName: order.customerName,
  phone: maskPhone(order.phone),
  orderType: order.orderType,
  tableNumber: order.tableNumber ?? null,
  items: order.items.map(({ menuItem, name, price, quantity, image }) => ({
    menuItem,
    name,
    price,
    quantity,
    image,
    lineTotal: roundCurrency(price * quantity),
  })),
  subtotal: order.subtotal,
  totalAmount: order.totalAmount,
  specialInstructions: order.specialInstructions,
  status: order.status,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});
