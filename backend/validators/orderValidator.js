import { body, query } from 'express-validator';
import { INDIAN_MOBILE_REGEX, LIMITS, ORDER_STATUSES, ORDER_TYPES } from '../config/constants.js';
import { normalizePhone } from '../utils/phone.js';
import { mongoIdParam, paginationQuery, toCanonical } from './commonValidators.js';

const ORDER_NUMBER_REGEX = /^BB-\d{6}-[A-Z0-9]{5}$/;
const NAME_REGEX = /^[\p{L}][\p{L}\s.'-]*$/u;

const phoneRule = (chain) =>
  chain
    .exists({ values: 'falsy' })
    .withMessage('Phone number is required')
    .bail()
    .isString()
    .customSanitizer((value) => value.replace(/[\s()-]/g, ''))
    .matches(INDIAN_MOBILE_REGEX)
    .withMessage('Enter a valid 10-digit Indian mobile number')
    .customSanitizer(normalizePhone);

const isBlank = (value) => value === undefined || value === null || value === '';

export const createOrderValidator = [
  body('customerName')
    .exists({ values: 'falsy' })
    .withMessage('Customer name is required')
    .bail()
    .isString()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters')
    .matches(NAME_REGEX)
    .withMessage('Name can only contain letters, spaces, dots, apostrophes and hyphens'),
  phoneRule(body('phone')),
  body('orderType')
    .exists({ values: 'falsy' })
    .withMessage('Order type is required')
    .bail()
    .customSanitizer(toCanonical(ORDER_TYPES))
    .isIn(ORDER_TYPES)
    .withMessage(`Order type must be one of: ${ORDER_TYPES.join(', ')}`),
  body('tableNumber')
    .custom((value, { req }) => {
      if (isBlank(value)) {
        if (req.body.orderType === 'dine-in') throw new Error('Table number is required for dine-in orders');
        return true;
      }
      const tableNumber = Number(value);
      if (!Number.isInteger(tableNumber) || tableNumber < LIMITS.minTableNumber || tableNumber > LIMITS.maxTableNumber) {
        throw new Error(`Table number must be between ${LIMITS.minTableNumber} and ${LIMITS.maxTableNumber}`);
      }
      return true;
    })
    .customSanitizer((value) => (isBlank(value) ? undefined : Number(value))),
  body('specialInstructions')
    .optional({ values: 'null' })
    .isString()
    .withMessage('Special instructions must be text')
    .trim()
    .isLength({ max: LIMITS.maxSpecialInstructions })
    .withMessage(`Special instructions cannot exceed ${LIMITS.maxSpecialInstructions} characters`),
  body('items')
    .isArray({ min: 1, max: LIMITS.maxOrderLines })
    .withMessage(`Order must contain between 1 and ${LIMITS.maxOrderLines} items`),
  body('items.*.menuItem').isMongoId().withMessage('Each item must reference a valid menu item ID'),
  body('items.*.quantity')
    .isInt({ min: 1, max: LIMITS.maxItemQuantity })
    .withMessage(`Quantity must be a whole number between 1 and ${LIMITS.maxItemQuantity}`)
    .toInt(),
];

export const listOrdersValidator = [
  query('status')
    .optional({ values: 'falsy' })
    .customSanitizer(toCanonical(ORDER_STATUSES))
    .isIn(ORDER_STATUSES)
    .withMessage(`status must be one of: ${ORDER_STATUSES.join(', ')}`),
  ...paginationQuery,
];

export const orderIdValidator = [mongoIdParam('id', 'order ID')];

export const trackOrderValidator = [
  query('orderNumber')
    .exists({ values: 'falsy' })
    .withMessage('Order number is required')
    .bail()
    .isString()
    .trim()
    .toUpperCase()
    .matches(ORDER_NUMBER_REGEX)
    .withMessage('Order number format should look like BB-261115-AB3CD'),
  phoneRule(query('phone')),
];

export const updateOrderStatusValidator = [
  mongoIdParam('id', 'order ID'),
  body('status')
    .exists({ values: 'falsy' })
    .withMessage('Status is required')
    .bail()
    .customSanitizer(toCanonical(ORDER_STATUSES))
    .isIn(ORDER_STATUSES)
    .withMessage(`Status must be one of: ${ORDER_STATUSES.join(', ')}`),
];
