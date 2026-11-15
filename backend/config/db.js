import mongoose from 'mongoose';
import env from './env.js';

mongoose.set('strictQuery', true);
mongoose.set('sanitizeFilter', true);

const RETRY_DELAY_MS = 10000;
const MAX_PRODUCTION_ATTEMPTS = 5;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const collectErrorText = (error) => {
  const serverErrors = [...(error?.reason?.servers?.values?.() ?? [])].map((server) => server.error?.message ?? '');
  return [error?.message ?? '', error?.codeName ?? '', ...serverErrors].join(' ');
};

const explainConnectionError = (error) => {
  const text = collectErrorText(error);

  if (/bad auth|authentication failed/i.test(text)) {
    return [
      'MongoDB rejected the username or password in MONGODB_URI.',
      'Check Atlas > Database Access, and URL-encode special characters in the password (e.g. @ -> %40).',
    ];
  }
  if (/querySrv|ENOTFOUND|EAI_AGAIN/i.test(text)) {
    return [
      'The MongoDB host name could not be resolved.',
      'Check your internet connection and the cluster host in MONGODB_URI.',
    ];
  }
  if (/whitelist|access list|SSL alert number 80|tlsv1 alert internal error/i.test(text)) {
    return [
      "MongoDB Atlas refused this machine's IP address (it is not on the cluster's IP Access List).",
      'Fix: Atlas > Security > Network Access > "+ Add IP Address" > "Add Current IP Address" (or 0.0.0.0/0 for development/Render).',
      'Home and mobile internet IPs change often, so you may need to add the new IP again after switching networks.',
    ];
  }
  return [error?.message ?? 'Unknown database error'];
};

const connectOnce = () =>
  mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 10000,
    autoIndex: true,
  });

export const connectDB = async ({ retry = true } = {}) => {
  for (let attempt = 1; ; attempt += 1) {
    try {
      const connection = await connectOnce();
      console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);

      mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
      mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));
      mongoose.connection.on('error', (error) => console.error('MongoDB error:', error.message));

      return connection;
    } catch (error) {
      const [summary, ...details] = explainConnectionError(error);
      console.error(`\nMongoDB connection failed (attempt ${attempt}): ${summary}`);
      details.forEach((line) => console.error(`  ${line}`));

      if (!retry || (env.isProduction && attempt >= MAX_PRODUCTION_ATTEMPTS)) throw error;
      console.error(`  Retrying in ${RETRY_DELAY_MS / 1000} seconds... (press Ctrl+C to stop)`);
      await sleep(RETRY_DELAY_MS);
    }
  }
};

export const disconnectDB = () => mongoose.connection.close();

export const isDBConnected = () => mongoose.connection.readyState === 1;
