import mongoose from 'mongoose';
import { MENU_CATEGORIES } from '../config/constants.js';

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: { values: MENU_CATEGORIES, message: '{VALUE} is not a valid category' },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be at least 1'],
      max: [100000, 'Price is unrealistically high'],
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

menuSchema.index({ name: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });
menuSchema.index({ category: 1, price: 1 });
menuSchema.index({ isAvailable: 1, isFeatured: 1 });

const Menu = mongoose.model('Menu', menuSchema);

export default Menu;
