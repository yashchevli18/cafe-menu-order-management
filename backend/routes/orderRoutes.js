import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';
import validateRequest from '../middleware/validateRequest.js';
import requireManagementKey from '../middleware/requireManagementKey.js';
import { orderCreationLimiter, orderTrackingLimiter } from '../middleware/rateLimiters.js';
import {
  createOrderValidator,
  listOrdersValidator,
  orderIdValidator,
  trackOrderValidator,
  updateOrderStatusValidator,
} from '../validators/orderValidator.js';

const router = Router();

/**
 * @openapi
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Place a new order
 *     description: >
 *       Public endpoint, no login required. Prices are never accepted from the client:
 *       the server loads each menu item from MongoDB, rejects unavailable items,
 *       stores name/price snapshots and calculates totals. Rate limited per IP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateOrderInput' }
 *     responses:
 *       201:
 *         description: Order placed
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/PublicOrder' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *       429: { $ref: '#/components/responses/TooManyRequests' }
 *   get:
 *     tags: [Orders]
 *     summary: List orders (management)
 *     description: Management operation that returns full order records including customer phone numbers.
 *     security: [{ ManagementKey: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { $ref: '#/components/schemas/OrderStatus' }
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: Paginated list of orders, newest first
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Order' }
 *                     meta:
 *                       type: object
 *                       properties:
 *                         pagination: { $ref: '#/components/schemas/Pagination' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 */
router
  .route('/')
  .post(orderCreationLimiter, validateRequest(createOrderValidator), orderController.createOrder)
  .get(requireManagementKey, validateRequest(listOrdersValidator), orderController.getOrders);

/**
 * @openapi
 * /orders/track:
 *   get:
 *     tags: [Orders]
 *     summary: Track an order
 *     description: >
 *       Public endpoint. Both the order number and the phone number used when ordering must match;
 *       otherwise a generic 404 is returned so that order numbers cannot be probed. Rate limited per IP.
 *     parameters:
 *       - in: query
 *         name: orderNumber
 *         required: true
 *         schema: { type: string, example: BB-261115-K7Q2M }
 *       - in: query
 *         name: phone
 *         required: true
 *         schema: { type: string, example: '9876543210' }
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/PublicOrder' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       429: { $ref: '#/components/responses/TooManyRequests' }
 */
router.get('/track', orderTrackingLimiter, validateRequest(trackOrderValidator), orderController.trackOrder);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get an order by ID (management)
 *     security: [{ ManagementKey: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ObjectId'
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Order' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', requireManagementKey, validateRequest(orderIdValidator), orderController.getOrderById);

/**
 * @openapi
 * /orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order status (management)
 *     description: Completed and Cancelled are final states and cannot be changed afterwards.
 *     security: [{ ManagementKey: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ObjectId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { $ref: '#/components/schemas/OrderStatus' }
 *           example: { status: Preparing }
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Order' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router.patch(
  '/:id/status',
  requireManagementKey,
  validateRequest(updateOrderStatusValidator),
  orderController.updateOrderStatus,
);

export default router;
