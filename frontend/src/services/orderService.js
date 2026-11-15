import api, { withManagementKey } from './api';

export const createOrder = async (data) => {
  const response = await api.post('/orders', data);
  return response.data;
};

export const trackOrder = async (orderNumber, phone, { signal } = {}) => {
  const response = await api.get('/orders/track', { params: { orderNumber, phone }, signal });
  return response.data;
};

export const getAllOrders = async (params, { managementKey } = {}) => {
  const response = await api.get('/orders', withManagementKey(managementKey, { params }));
  return { orders: response.data, pagination: response.meta?.pagination };
};

export const getOrderById = async (id, { managementKey } = {}) => {
  const response = await api.get(`/orders/${id}`, withManagementKey(managementKey));
  return response.data;
};

export const updateOrderStatus = async (id, status, { managementKey } = {}) => {
  const response = await api.patch(`/orders/${id}/status`, { status }, withManagementKey(managementKey));
  return response.data;
};
