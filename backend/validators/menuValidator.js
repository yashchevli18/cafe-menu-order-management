import { body, query } from 'express-validator';
import { MENU_CATEGORIES, MENU_SORT_OPTIONS } from '../config/constants.js';
import { mongoIdParam, paginationQuery, toCanonical } from './commonValidators.js';

const MENU_FIELDS = ['name', 'description', 'category', 'price', 'image', 'isAvailable', 'isFeatured'];

const booleanQuery = (field) =>
  query(field)
    .optional()
    .isIn(['true', 'false'])
    .withMessage(`${field} must be true or false`)
    .toBoolean(true);

const booleanBody = (field) =>
  body(field)
    .optional()
    .isBoolean({ strict: true })
    .withMessage(`${field} must be true or false`)
    .toBoolean(true);

const menuBodyRules = (isUpdate) => {
  const required = (field, label, emptyValues = 'falsy') =>
    isUpdate
      ? body(field).optional()
      : body(field).exists({ values: emptyValues }).withMessage(`${label} is required`).bail();

  return [
    required('name', 'Name')
      .isString()
      .trim()
      .isLength({ min: 2, max: 80 })
      .withMessage('Name must be between 2 and 80 characters'),
    required('description', 'Description')
      .isString()
      .trim()
      .isLength({ min: 10, max: 300 })
      .withMessage('Description must be between 10 and 300 characters'),
    required('category', 'Category')
      .customSanitizer(toCanonical(MENU_CATEGORIES))
      .isIn(MENU_CATEGORIES)
      .withMessage(`Category must be one of: ${MENU_CATEGORIES.join(', ')}`),
    required('price', 'Price', 'null')
      .isFloat({ min: 1, max: 100000 })
      .withMessage('Price must be a number between 1 and 100000')
      .toFloat(),
    body('image')
      .optional({ values: 'falsy' })
      .isString()
      .trim()
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage('Image must be a valid http(s) URL'),
    booleanBody('isAvailable'),
    booleanBody('isFeatured'),
  ];
};

export const listMenuValidator = [
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 60 })
    .withMessage('search cannot exceed 60 characters'),
  query('category')
    .optional({ values: 'falsy' })
    .customSanitizer(toCanonical(MENU_CATEGORIES))
    .isIn(MENU_CATEGORIES)
    .withMessage(`category must be one of: ${MENU_CATEGORIES.join(', ')}`),
  query('sort')
    .optional()
    .isIn(Object.keys(MENU_SORT_OPTIONS))
    .withMessage(`sort must be one of: ${Object.keys(MENU_SORT_OPTIONS).join(', ')}`),
  booleanQuery('available'),
  booleanQuery('featured'),
  ...paginationQuery,
];

export const menuIdValidator = [mongoIdParam('id', 'menu item ID')];

export const createMenuValidator = menuBodyRules(false);

export const updateMenuValidator = [
  mongoIdParam('id', 'menu item ID'),
  body()
    .custom((value) => value && MENU_FIELDS.some((field) => field in value))
    .withMessage(`Provide at least one field to update: ${MENU_FIELDS.join(', ')}`),
  ...menuBodyRules(true),
];
