import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const parseList = (value) =>
  (value || '')
    .split(',')
    .map((entry) => entry.trim().replace(/\/$/, ''))
    .filter(Boolean);

const nodeEnv = process.env.NODE_ENV || 'development';

const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  clientUrls: parseList(process.env.CLIENT_URL || 'http://localhost:5173'),
  managementApiKey: process.env.MANAGEMENT_API_KEY || '',
  trustProxy: Number(process.env.TRUST_PROXY ?? (nodeEnv === 'production' ? 1 : 0)),
};

export const assertRequiredEnv = () => {
  const missing = [];
  if (!env.mongoUri) missing.push('MONGODB_URI');
  if (env.isProduction && !env.managementApiKey) missing.push('MANAGEMENT_API_KEY');

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

export default env;
