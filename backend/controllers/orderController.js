import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as orderService from '../services/orderService.js';

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.validated.body);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Order placed successfully',
    data: orderService.toPublicOrder(order),
  });
});

export const getOrders = asyncHandler(async (req, res) => {
  const { orders, pagination } = await orderService.getOrders(req.validated.query);
  sendSuccess(res, { message: 'Orders retrieved successfully', data: orders, meta: { pagination } });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.validated.params.id);
  sendSuccess(res, { message: 'Order retrieved successfully', data: order });
});

export const trackOrder = asyncHandler(async (req, res) => {
  const order = await orderService.trackOrder(req.validated.query);
  sendSuccess(res, { message: 'Order found', data: orderService.toPublicOrder(order) });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.validated.params.id, req.validated.body.status);
  sendSuccess(res, { message: `Order status updated to ${order.status}`, data: order });
});
