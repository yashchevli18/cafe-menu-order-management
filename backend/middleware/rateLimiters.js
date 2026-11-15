import rateLimit from 'express-rate-limit';

const createLimiter = ({ windowMs, limit, message, ...options }) =>
  rateLimit({
    windowMs,
    limit,
    ...options,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({ success: false, message, errors: [] }),
  });

export const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  message: 'Too many requests. Please try again in a few minutes.',
});

export const orderCreationLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  limit: 15,
  skipFailedRequests: true,
  message: 'Too many orders placed from this device. Please wait a few minutes and try again.',
});

export const orderTrackingLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  skipSuccessfulRequests: true,
  message: 'Too many unsuccessful tracking attempts. Please wait a few minutes and try again.',
});
