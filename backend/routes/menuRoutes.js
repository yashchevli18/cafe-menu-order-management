import { Router } from 'express';
import * as menuController from '../controllers/menuController.js';
import validateRequest from '../middleware/validateRequest.js';
import requireManagementKey from '../middleware/requireManagementKey.js';
import {
  createMenuValidator,
  listMenuValidator,
  menuIdValidator,
  updateMenuValidator,
} from '../validators/menuValidator.js';

const router = Router();

/**
 * @openapi
 * /menu:
 *   get:
 *     tags: [Menu]
 *     summary: List menu items
 *     description: Returns menu items with optional name search, category filter, availability filter, price sorting and pagination.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string, maxLength: 60 }
 *         description: Case-insensitive partial match on the item name.
 *         example: latte
 *       - in: query
 *         name: category
 *         schema: { $ref: '#/components/schemas/Category' }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [default, price_asc, price_desc, newest], default: default }
 *       - in: query
 *         name: available
 *         schema: { type: boolean }
 *       - in: query
 *         name: featured
 *         schema: { type: boolean }
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *     responses:
 *       200:
 *         description: Paginated list of menu items
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/MenuItem' }
 *                     meta:
 *                       type: object
 *                       properties:
 *                         pagination: { $ref: '#/components/schemas/Pagination' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *   post:
 *     tags: [Menu]
 *     summary: Create a menu item
 *     description: Management operation. Requires the `x-api-key` header when MANAGEMENT_API_KEY is configured.
 *     security: [{ ManagementKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MenuItemInput' }
 *     responses:
 *       201:
 *         description: Menu item created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/MenuItem' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       409: { $ref: '#/components/responses/Conflict' }
 */
router
  .route('/')
  .get(validateRequest(listMenuValidator), menuController.getMenuItems)
  .post(requireManagementKey, validateRequest(createMenuValidator), menuController.createMenuItem);

/**
 * @openapi
 * /menu/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/ObjectId'
 *   get:
 *     tags: [Menu]
 *     summary: Get a menu item by ID
 *     responses:
 *       200:
 *         description: Menu item found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/MenuItem' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *   put:
 *     tags: [Menu]
 *     summary: Update a menu item
 *     description: Management operation. Send any subset of fields; only provided fields are changed.
 *     security: [{ ManagementKey: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MenuItemUpdate' }
 *     responses:
 *       200:
 *         description: Menu item updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/MenuItem' }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409: { $ref: '#/components/responses/Conflict' }
 *   delete:
 *     tags: [Menu]
 *     summary: Delete a menu item
 *     description: Management operation. Existing orders keep their item snapshots.
 *     security: [{ ManagementKey: [] }]
 *     responses:
 *       200:
 *         description: Menu item deleted
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *             example:
 *               success: true
 *               message: Menu item deleted successfully
 *               data: { _id: 665f1c2ab3d4e5f6a7b8c9d0, name: Caramel Macchiato }
 *       400: { $ref: '#/components/responses/BadRequest' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       404: { $ref: '#/components/responses/NotFound' }
 */
router
  .route('/:id')
  .get(validateRequest(menuIdValidator), menuController.getMenuItemById)
  .put(requireManagementKey, validateRequest(updateMenuValidator), menuController.updateMenuItem)
  .delete(requireManagementKey, validateRequest(menuIdValidator), menuController.deleteMenuItem);

export default router;
