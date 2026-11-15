import { Router } from 'express';
import { isDBConnected } from '../config/db.js';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     description: Lightweight endpoint for uptime monitors and cron pings.
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Cafe API is running
 *               data: { database: connected, uptimeSeconds: 42, timestamp: '2026-11-15T10:00:00.000Z' }
 *       503:
 *         description: API is running but the database is not connected
 */
router.get('/', (req, res) => {
  const databaseConnected = isDBConnected();
  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    message: databaseConnected ? 'Cafe API is running' : 'Cafe API is running but the database is unavailable',
    data: {
      database: databaseConnected ? 'connected' : 'disconnected',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
