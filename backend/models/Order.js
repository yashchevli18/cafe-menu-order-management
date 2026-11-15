import mongoose from 'mongoose';
import { LIMITS, ORDER_STATUSES, ORDER_TYPES } from '../config/constants.js';

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      max: [LIMITS.maxItemQuantity, `Quantity cannot exceed ${LIMITS.maxItemQuantity}`],
      validate: { validator: Number.isInteger, message: 'Quantity must be a whole number' },
    },
    image: { type: String, default: '' },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: 60,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian mobile number'],
    },
    tableNumber: {
      type: Number,
      min: LIMITS.minTableNumber,
      max: LIMITS.maxTableNumber,
      required: [
        function isDineIn() {
          return this.orderType === 'dine-in';
        },
        'Table number is required for dine-in orders',
      ],
      validate: { validator: Number.isInteger, message: 'Table number must be a whole number' },
    },
    orderType: {
      type: String,
      enum: { values: ORDER_TYPES, message: '{VALUE} is not a valid order type' },
      required: true,
      default: 'dine-in',
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'An order must contain at least one item',
      },
    },
    subtotal: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: LIMITS.maxSpecialInstructions,
      default: '',
    },
    status: {
      type: String,
      enum: { values: ORDER_STATUSES, message: '{VALUE} is not a valid status' },
      default: 'Pending',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

orderSchema.index({ orderNumber: 1, phone: 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
