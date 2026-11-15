import api, { withManagementKey } from './api';

const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );

export const getMenuItems = async (params, { signal } = {}) => {
  const response = await api.get('/menu', { params: cleanParams(params), signal });
  return { items: response.data, pagination: response.meta?.pagination };
};

export const getMenuItemById = async (id, { signal } = {}) => {
  const response = await api.get(`/menu/${id}`, { signal });
  return response.data;
};

export const createMenuItem = async (data, { managementKey } = {}) => {
  const response = await api.post('/menu', data, withManagementKey(managementKey));
  return response.data;
};

export const updateMenuItem = async (id, data, { managementKey } = {}) => {
  const response = await api.put(`/menu/${id}`, data, withManagementKey(managementKey));
  return response.data;
};

export const deleteMenuItem = async (id, { managementKey } = {}) => {
  const response = await api.delete(`/menu/${id}`, withManagementKey(managementKey));
  return response.data;
};
