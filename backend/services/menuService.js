import mongoose from 'mongoose';
import Menu from '../models/Menu.js';
import ApiError from '../utils/ApiError.js';
import { buildPagination } from '../utils/apiResponse.js';
import { LIMITS, MENU_SORT_OPTIONS } from '../config/constants.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildMenuFilter = ({ search, category, available, featured }) => {
  const filter = {};

  if (search) filter.name = new RegExp(escapeRegex(search), 'i');
  if (category) filter.category = category;
  if (typeof available === 'boolean') filter.isAvailable = available;
  if (typeof featured === 'boolean') filter.isFeatured = featured;

  return filter;
};

export const getMenuItems = async ({
  search,
  category,
  available,
  featured,
  sort = 'default',
  page = 1,
  limit = LIMITS.defaultPageSize,
} = {}) => {
  const filter = buildMenuFilter({ search, category, available, featured });
  const sortBy = MENU_SORT_OPTIONS[sort] || MENU_SORT_OPTIONS.default;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Menu.find(filter).sort(sortBy).skip(skip).limit(limit).lean(),
    Menu.countDocuments(filter),
  ]);

  return { items, pagination: buildPagination({ page, limit, total }) };
};

export const getMenuItemById = async (id) => {
  const item = await Menu.findById(id).lean();
  if (!item) throw ApiError.notFound('Menu item not found');
  return item;
};

export const createMenuItem = async (data) => {
  const item = await Menu.create(data);
  return item.toObject();
};

export const updateMenuItem = async (id, updates) => {
  const item = await Menu.findByIdAndUpdate(id, updates, {
    returnDocument: 'after',
    runValidators: true,
  }).lean();
  if (!item) throw ApiError.notFound('Menu item not found');
  return item;
};

export const deleteMenuItem = async (id) => {
  const item = await Menu.findByIdAndDelete(id).lean();
  if (!item) throw ApiError.notFound('Menu item not found');
  return item;
};

export const getMenuItemsByIds = (ids) =>
  Menu.find({ _id: mongoose.trusted({ $in: ids }) }).lean();
