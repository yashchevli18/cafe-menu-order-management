import { createHash, timingSafeEqual } from 'node:crypto';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

const digest = (value) => createHash('sha256').update(String(value)).digest();

let warnedAboutOpenAccess = false;

const requireManagementKey = (req, res, next) => {
  if (!env.managementApiKey) {
    if (env.isProduction) return next(ApiError.forbidden('Management API is disabled on this server'));
    if (!warnedAboutOpenAccess) {
      console.warn('MANAGEMENT_API_KEY is not set: management endpoints are open (development only).');
      warnedAboutOpenAccess = true;
    }
    return next();
  }

  const providedKey = req.get('x-api-key');
  if (!providedKey || !timingSafeEqual(digest(providedKey), digest(env.managementApiKey))) {
    return next(ApiError.unauthorized());
  }

  return next();
};

export default requireManagementKey;
