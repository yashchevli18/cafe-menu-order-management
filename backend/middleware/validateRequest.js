import { matchedData, validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

const validateRequest = (validators) => [
  ...validators,
  (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errors = result.array({ onlyFirstError: true }).map((error) => ({
        field: error.path ?? error.type,
        location: error.location,
        message: error.msg,
      }));
      return next(ApiError.badRequest('Validation failed', errors));
    }

    req.validated = {
      body: matchedData(req, { locations: ['body'] }),
      query: matchedData(req, { locations: ['query'] }),
      params: matchedData(req, { locations: ['params'] }),
    };
    return next();
  },
];

export default validateRequest;
