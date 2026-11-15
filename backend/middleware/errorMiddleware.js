import mongoose from 'mongoose';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

const DB_UNAVAILABLE_ERRORS = new Set([
  'MongooseServerSelectionError',
  'MongoServerSelectionError',
  'MongoNetworkError',
  'MongoNotConnectedError',
]);

const normalizeError = (error) => {
  if (error instanceof ApiError) return error;

  if (error.type === 'entity.parse.failed') {
    return ApiError.badRequest('Request body contains invalid JSON');
  }

  if (error.type === 'entity.too.large') {
    return new ApiError(413, 'Request body is too large');
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map((detail) => ({
      field: detail.path,
      message: detail.message,
    }));
    return ApiError.badRequest('Validation failed', errors);
  }

  if (error instanceof mongoose.Error.CastError) {
    return ApiError.badRequest(`Invalid value for ${error.path}`, [{ field: error.path, message: 'Invalid format' }]);
  }

  if (error.code === 11000) {
    const fields = Object.keys(error.keyPattern || error.keyValue || {});
    const field = fields[0] || 'field';
    const message =
      field === 'orderNumber'
        ? 'Duplicate order number generated. Please try placing the order again.'
        : `A record with this ${field} already exists`;
    return ApiError.conflict(message, fields.map((name) => ({ field: name, message: 'Must be unique' })));
  }

  if (DB_UNAVAILABLE_ERRORS.has(error.name) || mongoose.connection.readyState !== 1) {
    return ApiError.unavailable('Database is temporarily unavailable. Please try again shortly.');
  }

  return new ApiError(500, 'Something went wrong');
};

export const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
};

// Express identifies error-handling middleware by its four-argument signature.
export const errorHandler = (error, req, res, next) => {
  const apiError = normalizeError(error);

  if (apiError.statusCode >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, error);
  }

  const body = {
    success: false,
    message: apiError.message,
    errors: apiError.errors || [],
  };

  if (!env.isProduction && apiError.statusCode >= 500) {
    body.stack = error.stack;
  }

  res.status(apiError.statusCode).json(body);
};
