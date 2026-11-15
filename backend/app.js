import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import env from './config/env.js';
import swaggerSpec from './config/swagger.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { apiLimiter } from './middleware/rateLimiters.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { sendSuccess } from './utils/apiResponse.js';

const app = express();

app.set('trust proxy', env.trustProxy);
app.disable('x-powered-by');

const LOCAL_NETWORK_ORIGIN =
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})(:\d+)?$/;

const isAllowedOrigin = (origin) =>
  env.clientUrls.includes(origin) || (!env.isProduction && LOCAL_NETWORK_ORIGIN.test(origin));

const corsOptions = {
  origin(origin, callback) {
    callback(null, !origin || isAllowedOrigin(origin));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '20kb' }));

app.use(
  '/api/docs',
  helmet({ contentSecurityPolicy: false }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Brew & Bean API Docs',
    swaggerOptions: { persistAuthorization: true, displayRequestDuration: true },
  }),
);
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

app.use(helmet());

app.get('/', (req, res) =>
  sendSuccess(res, {
    message: 'Welcome to the Brew & Bean Cafe API',
    data: { docs: '/api/docs', health: '/api/health' },
  }),
);

app.use('/api/health', healthRoutes);
app.use('/api', apiLimiter);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
