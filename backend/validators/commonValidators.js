import { param, query } from 'express-validator';
import { LIMITS } from '../config/constants.js';

export const toCanonical = (allowedValues) => (value) => {
  if (typeof value !== 'string') return value;
  const match = allowedValues.find((allowed) => allowed.toLowerCase() === value.trim().toLowerCase());
  return match ?? value.trim();
};

export const mongoIdParam = (name = 'id', label = 'ID') =>
  param(name).isMongoId().withMessage(`Invalid ${label}`);

export const paginationQuery = [
  query('page')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: LIMITS.maxPageSize })
    .withMessage(`limit must be between 1 and ${LIMITS.maxPageSize}`)
    .toInt(),
];
