import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as menuService from '../services/menuService.js';

export const getMenuItems = asyncHandler(async (req, res) => {
  const { items, pagination } = await menuService.getMenuItems(req.validated.query);
  sendSuccess(res, { message: 'Menu items retrieved successfully', data: items, meta: { pagination } });
});

export const getMenuItemById = asyncHandler(async (req, res) => {
  const item = await menuService.getMenuItemById(req.validated.params.id);
  sendSuccess(res, { message: 'Menu item retrieved successfully', data: item });
});

export const createMenuItem = asyncHandler(async (req, res) => {
  const item = await menuService.createMenuItem(req.validated.body);
  sendSuccess(res, { statusCode: 201, message: 'Menu item created successfully', data: item });
});

export const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await menuService.updateMenuItem(req.validated.params.id, req.validated.body);
  sendSuccess(res, { message: 'Menu item updated successfully', data: item });
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await menuService.deleteMenuItem(req.validated.params.id);
  sendSuccess(res, { message: 'Menu item deleted successfully', data: { _id: item._id, name: item.name } });
});
