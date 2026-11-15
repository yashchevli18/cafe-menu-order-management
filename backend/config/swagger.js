import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerJSDoc from 'swagger-jsdoc';
import { LIMITS, MENU_CATEGORIES, ORDER_STATUSES, ORDER_TYPES } from './constants.js';

const routesGlob = path
  .join(path.dirname(fileURLToPath(import.meta.url)), '..', 'routes', '*.js')
  .replace(/\\/g, '/');

const errorResponse = (description, example) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorResponse' },
      example,
    },
  },
});

const definition = {
  openapi: '3.0.3',
  info: {
    title: 'Brew & Bean Cafe API',
    version: '1.0.0',
    description:
      'REST API for the Brew & Bean cafe menu and QR ordering system.\n\n' +
      'Public endpoints: menu listing/details, placing orders and tracking orders.\n\n' +
      'Management endpoints (menu create/update/delete, order listing, order details and status updates) ' +
      'require the `x-api-key` header matching the server MANAGEMENT_API_KEY. Click **Authorize** to set it.',
  },
  servers: [{ url: '/api', description: 'Current server' }],
  tags: [
    { name: 'Menu', description: 'Menu catalogue and CRUD management' },
    { name: 'Orders', description: 'Customer ordering, tracking and order management' },
    { name: 'Health', description: 'Service health' },
  ],
  components: {
    securitySchemes: {
      ManagementKey: { type: 'apiKey', in: 'header', name: 'x-api-key' },
    },
    parameters: {
      ObjectId: {
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' },
        description: 'MongoDB ObjectId',
        example: '665f1c2ab3d4e5f6a7b8c9d0',
      },
      Page: { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1, default: 1 } },
      Limit: {
        in: 'query',
        name: 'limit',
        schema: { type: 'integer', minimum: 1, maximum: LIMITS.maxPageSize, default: LIMITS.defaultPageSize },
      },
    },
    schemas: {
      Category: { type: 'string', enum: MENU_CATEGORIES },
      OrderStatus: { type: 'string', enum: ORDER_STATUSES },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Order placed successfully' },
          data: { type: 'object' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Something went wrong' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                location: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 12 },
          total: { type: 'integer', example: 20 },
          totalPages: { type: 'integer', example: 2 },
          hasNextPage: { type: 'boolean', example: true },
          hasPrevPage: { type: 'boolean', example: false },
        },
      },
      MenuItem: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665f1c2ab3d4e5f6a7b8c9d0' },
          name: { type: 'string', example: 'Caramel Macchiato' },
          description: { type: 'string', example: 'Espresso layered with steamed milk and caramel drizzle.' },
          category: { $ref: '#/components/schemas/Category' },
          price: { type: 'number', example: 260 },
          image: { type: 'string', example: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800' },
          isAvailable: { type: 'boolean', example: true },
          isFeatured: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      MenuItemInput: {
        type: 'object',
        required: ['name', 'description', 'category', 'price'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 80 },
          description: { type: 'string', minLength: 10, maxLength: 300 },
          category: { $ref: '#/components/schemas/Category' },
          price: { type: 'number', minimum: 1 },
          image: { type: 'string', format: 'uri' },
          isAvailable: { type: 'boolean', default: true },
          isFeatured: { type: 'boolean', default: false },
        },
        example: {
          name: 'Hazelnut Latte',
          description: 'Double shot espresso with steamed milk and roasted hazelnut syrup.',
          category: 'Coffee',
          price: 240,
          image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800',
          isAvailable: true,
        },
      },
      MenuItemUpdate: {
        type: 'object',
        minProperties: 1,
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 80 },
          description: { type: 'string', minLength: 10, maxLength: 300 },
          category: { $ref: '#/components/schemas/Category' },
          price: { type: 'number', minimum: 1 },
          image: { type: 'string', format: 'uri' },
          isAvailable: { type: 'boolean' },
          isFeatured: { type: 'boolean' },
        },
        example: { price: 250, isAvailable: false },
      },
      OrderItem: {
        type: 'object',
        properties: {
          menuItem: { type: 'string', example: '665f1c2ab3d4e5f6a7b8c9d0' },
          name: { type: 'string', example: 'Cappuccino' },
          price: { type: 'number', example: 180 },
          quantity: { type: 'integer', example: 2 },
          image: { type: 'string' },
        },
      },
      CreateOrderInput: {
        type: 'object',
        required: ['customerName', 'phone', 'orderType', 'items'],
        properties: {
          customerName: { type: 'string', minLength: 2, maxLength: 60 },
          phone: { type: 'string', description: '10-digit Indian mobile number, optional +91/0 prefix' },
          orderType: { type: 'string', enum: ORDER_TYPES },
          tableNumber: {
            type: 'integer',
            minimum: LIMITS.minTableNumber,
            maximum: LIMITS.maxTableNumber,
            description: 'Required for dine-in, ignored for takeaway',
          },
          specialInstructions: { type: 'string', maxLength: LIMITS.maxSpecialInstructions },
          items: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['menuItem', 'quantity'],
              properties: {
                menuItem: { type: 'string', description: 'Menu item ObjectId' },
                quantity: { type: 'integer', minimum: 1, maximum: LIMITS.maxItemQuantity },
              },
            },
          },
        },
        example: {
          customerName: 'Aarav Sharma',
          phone: '9876543210',
          orderType: 'dine-in',
          tableNumber: 5,
          specialInstructions: 'Less sugar in the cold coffee, please.',
          items: [
            { menuItem: '665f1c2ab3d4e5f6a7b8c9d0', quantity: 2 },
            { menuItem: '665f1c2ab3d4e5f6a7b8c9d1', quantity: 1 },
          ],
        },
      },
      PublicOrder: {
        type: 'object',
        description: 'Customer-facing order view. The phone number is masked.',
        properties: {
          orderNumber: { type: 'string', example: 'BB-261115-K7Q2M' },
          customerName: { type: 'string', example: 'Aarav Sharma' },
          phone: { type: 'string', example: '******3210' },
          orderType: { type: 'string', enum: ORDER_TYPES },
          tableNumber: { type: 'integer', nullable: true, example: 5 },
          items: {
            type: 'array',
            items: {
              allOf: [
                { $ref: '#/components/schemas/OrderItem' },
                { type: 'object', properties: { lineTotal: { type: 'number', example: 360 } } },
              ],
            },
          },
          subtotal: { type: 'number', example: 600 },
          totalAmount: { type: 'number', example: 600 },
          specialInstructions: { type: 'string' },
          status: { $ref: '#/components/schemas/OrderStatus' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Order: {
        type: 'object',
        description: 'Full order record (management view).',
        properties: {
          _id: { type: 'string' },
          orderNumber: { type: 'string', example: 'BB-261115-K7Q2M' },
          customerName: { type: 'string' },
          phone: { type: 'string', example: '9876543210' },
          orderType: { type: 'string', enum: ORDER_TYPES },
          tableNumber: { type: 'integer' },
          items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
          subtotal: { type: 'number' },
          totalAmount: { type: 'number' },
          specialInstructions: { type: 'string' },
          status: { $ref: '#/components/schemas/OrderStatus' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
    responses: {
      BadRequest: errorResponse('Validation failed or malformed request', {
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'phone', location: 'body', message: 'Enter a valid 10-digit Indian mobile number' }],
      }),
      Unauthorized: errorResponse('Missing or invalid management API key', {
        success: false,
        message: 'A valid management API key is required',
        errors: [],
      }),
      NotFound: errorResponse('Resource not found', {
        success: false,
        message: 'Menu item not found',
        errors: [],
      }),
      Conflict: errorResponse('Request conflicts with current state', {
        success: false,
        message: 'Some items in your order cannot be fulfilled',
        errors: [{ field: 'items', value: '665f1c2ab3d4e5f6a7b8c9d0', message: 'Cold Coffee is currently unavailable' }],
      }),
      TooManyRequests: errorResponse('Rate limit exceeded', {
        success: false,
        message: 'Too many requests. Please try again in a few minutes.',
        errors: [],
      }),
    },
  },
};

const swaggerSpec = swaggerJSDoc({ definition, apis: [routesGlob] });

export default swaggerSpec;
